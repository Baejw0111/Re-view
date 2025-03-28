import multer from "multer"; // 파일 업로드용
import path from "path"; // 파일 경로 설정용
import multerS3 from "multer-s3"; // S3 업로드용
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3"; // AWS S3 클라이언트 사용

// 파일 확장자 검증 함수
const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".webp"]; // 허용할 확장자 목록
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true); // 허용된 확장자일 경우
  } else {
    cb(new Error(`webp 확장자를 가진 파일만 업로드할 수 있습니다.`), false); // 허용되지 않은 확장자일 경우
  }
};

// AWS S3 인스턴스 생성
const s3 = new S3Client({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// 파일 업로드 처리
export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE, // 파일 타입 자동 설정
    // 파일 이름 설정
    key: function (req, file, cb) {
      const ext = path.extname(file.originalname); // 파일 확장자 추출
      const originalName = Buffer.from(
        path.basename(file.originalname, ext),
        "latin1"
      ).toString("utf8"); // 추출한 파일 이름을 UTF-8로 인코딩
      cb(null, originalName + "_" + Date.now() + ext); // 파일 이름 설정
    },
  }),
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

/**
 * Multer 에러 처리 함수
 * @returns - 에러 처리 결과
 */
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "파일 크기는 5MB를 초과할 수 없습니다." });
    }
    return res.status(400).json({ message: err.message });
  } else if (
    err.message === "webp 확장자를 가진 파일만 업로드할 수 있습니다."
  ) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
};

/**
 * S3에 업로드된 파일 삭제
 * @param {string[]} fileKeys - 삭제할 파일 키 배열
 */
export const deleteUploadedFiles = async (fileKeys) => {
  for (const fileKey of fileKeys) {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
    };

    try {
      await s3.send(new DeleteObjectCommand(params));
      console.log(`Successfully deleted file ${fileKey}`);
    } catch (err) {
      console.error(`Failed to delete file ${fileKey}:`, err);
    }
  }
};

/**
 * 리뷰 업로드 시 필드 존재 여부 검증
 * @param {object} req - 요청 객체
 * @param {object} res - 응답 객체
 * @param {function} next - 다음 미들웨어 함수
 * @returns {object} - 검증 결과 및 메세지
 */
export const checkFormFieldsExistence = (req, res, next) => {
  const { title, reviewText, rating, tags } = req.body;
  const files = req.files;

  let missingFields = [];

  if (!title) {
    missingFields.push("제목");
  }

  if (!reviewText) {
    missingFields.push("리뷰 내용");
  }

  if (!rating) {
    missingFields.push("평점");
  }

  if (!tags) {
    missingFields.push("태그");
  }

  if (!files) {
    missingFields.push("이미지");
  }

  if (missingFields.length > 0) {
    deleteUploadedFiles(files.map((file) => file.key));

    const message = `${missingFields.join(
      ", "
    )}가 누락되었습니다. 누락된 부분을 입력 후 다시 시도해주세요.`;

    console.log(message);
    return res.status(400).json({
      message,
    });
  }

  return next();
};

/**
 * 리뷰 업로드 시 필드 제한 값
 */
const fieldLimits = {
  title: 20,
  reviewText: 4000,
  tags: 5,
  files: 5,
};

/**
 * 리뷰 업로드 시 필드 검증 함수
 * @param {object} req - 요청 객체
 * @param {object} res - 응답 객체
 * @param {function} next - 다음 미들웨어 함수
 * @returns {object} - 검증 결과 및 메세지
 */
export const verifyFormFields = (req, res, next) => {
  const { title, reviewText, rating, tags } = req.body;
  const files = req.files;

  let invalidMessages = [];

  // 제목 검증
  if (title && title.length > fieldLimits.title) {
    invalidMessages.push(`제목은 ${fieldLimits.title}자 이하여야 합니다.`);
  }

  // 리뷰 내용 검증
  if (reviewText && reviewText.length > fieldLimits.reviewText) {
    invalidMessages.push(
      `리뷰 내용은 ${fieldLimits.reviewText}자 이하여야 합니다.`
    );
  }

  if (reviewText && reviewText.trim().length === 0) {
    invalidMessages.push(`리뷰 내용은 공백만 입력할 수 없습니다.`);
  }

  // 평점 검증
  if (rating && (rating < 0 || rating > 5)) {
    invalidMessages.push(`평점 값은 0점 이상, 5점 이하여야 합니다.`);
  }

  // 태그 검증
  if (tags && typeof tags === "object" && tags.length > fieldLimits.tags) {
    invalidMessages.push(
      `태그는 ${fieldLimits.tags}개까지 등록할 수 있습니다.`
    );
  }

  // 이미지 검증
  if (files && files.length > fieldLimits.files) {
    invalidMessages.push(
      `이미지는 ${fieldLimits.files}개까지 등록할 수 있습니다.`
    );
  }

  if (invalidMessages.length > 0) {
    deleteUploadedFiles(files.map((file) => file.key));
    const message = `${invalidMessages.join(
      "\n"
    )}\n위 내용을 참고해 다시 입력 후 재시도해주세요.`;

    console.log(message);
    return res.status(400).json({
      message,
    });
  }

  return next();
};
