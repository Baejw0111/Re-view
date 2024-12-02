import multer from "multer"; // 파일 업로드용
import path from "path"; // 파일 경로 설정용
import fs from "fs"; // 파일 삭제용

// 파일 업로드 처리
export const upload = multer({
  storage: multer.diskStorage({
    // 파일 저장 위치 설정
    destination: function (req, file, cb) {
      cb(null, path.join("public"));
    },
    // 파일 이름 설정
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname); // 파일 확장자 추출
      const originalName = Buffer.from(
        path.basename(file.originalname, ext),
        "latin1"
      ).toString("utf8"); // 추출한 파일 이름을 UTF-8로 인코딩
      cb(null, path.join(originalName + Date.now() + ext)); // 파일 이름 설정
    },
  }),
});

/**
 * 업로드된 파일 삭제
 * @param {string[]} filePaths - 삭제할 파일 경로 배열
 */
export const deleteUploadedFiles = (filePaths) => {
  filePaths.forEach((filePath) => fs.unlinkSync(filePath));
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
    deleteUploadedFiles(files.map((file) => file.path));

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
  reviewText: 1000,
  tags: 5,
  files: 5,
  maxFileSize: 5, // MB 단위
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

  // 파일 크기 검증
  if (
    files &&
    files.some((file) => file.size > fieldLimits.maxFileSize * 1024 * 1024)
  ) {
    invalidMessages.push(
      `파일 크기는 최대 ${fieldLimits.maxFileSize}MB까지 업로드할 수 있습니다.`
    );
  }

  // 파일 확장자 검증
  const isInvalidExtension =
    files &&
    files.some((file) => {
      const extension = file.path.split(".").pop().toLowerCase();
      return extension !== "webp";
    });

  if (isInvalidExtension) {
    invalidMessages.push(`파일 확장자는 webp만 업로드할 수 있습니다.`);
  }

  if (invalidMessages.length > 0) {
    deleteUploadedFiles(files.map((file) => file.path));
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
