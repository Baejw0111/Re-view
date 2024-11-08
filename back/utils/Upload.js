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
 * @param {string} title - 리뷰 제목
 * @param {string} reviewText - 리뷰 내용
 * @param {number} rating - 평점
 * @param {string[] | string} tags - 태그
 * @param {File[]} files - 이미지 파일
 * @returns {boolean} - 필드 존재 여부
 */
export const checkFormFieldsExistence = (
  title,
  reviewText,
  rating,
  tags,
  files
) => {
  let missingFields = [];

  if (!title) {
    missingFields.push("title");
  }

  if (!reviewText) {
    missingFields.push("reviewText");
  }

  if (!rating) {
    missingFields.push("rating");
  }

  if (!tags) {
    missingFields.push("tags");
  }

  if (!files) {
    missingFields.push("files");
  }

  if (missingFields.length > 0) {
    return {
      result: false,
      message: `필수 필드가 누락되었습니다: ${missingFields.join(", ")}`,
    };
  }

  return {
    result: true,
    message: "검증 성공",
  };
};

/**
 * 리뷰 업로드 시 필드 검증 함수
 * @param {string} title - 리뷰 제목
 * @param {string} reviewText - 리뷰 내용
 * @param {number} rating - 평점
 * @param {string[] | string} tags - 태그
 * @param {File[]} files - 이미지 파일
 * @returns {object} - 검증 결과 및 메세지
 */
export const verifyFormFields = (title, reviewText, rating, tags, files) => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const validExtensions = ["jpg", "jpeg", "png", "webp"];
  let invalidMessages = [];

  // 제목 검증
  if (title && title.length > 20) {
    invalidMessages.push("제목은 20자 이하여야 합니다.");
  }

  // 리뷰 내용 검증
  if (reviewText && reviewText.length > 1000) {
    invalidMessages.push("리뷰 내용은 1000자 이하여야 합니다.");
  }

  // 평점 검증
  if (rating && (rating < 0 || rating > 5)) {
    invalidMessages.push("평점 값은 0점 이상, 5점 이하여야 합니다.");
  }

  // 태그 검증
  if (tags && typeof tags === "object" && tags.length > 5) {
    invalidMessages.push("태그는 최대 5개까지 등록할 수 있습니다.");
  }

  // 이미지 검증
  if (files && files.length > 5) {
    invalidMessages.push("이미지는 최대 5개까지 등록할 수 있습니다.");
  }

  // 파일 크기 검증
  if (files && files.some((file) => file.size > MAX_FILE_SIZE)) {
    invalidMessages.push("파일 크기는 최대 5MB까지 업로드할 수 있습니다.");
  }

  // 파일 확장자 검증
  const isInvalidExtension =
    files &&
    files.some((file) => {
      const extension = file.originalname.split(".").pop().toLowerCase();
      return !validExtensions.includes(extension);
    });

  if (isInvalidExtension) {
    invalidMessages.push(
      "파일 확장자는 jpg, jpeg, png, webp만 업로드할 수 있습니다."
    );
  }

  if (invalidMessages.length > 0) {
    return {
      result: false,
      message: invalidMessages.join("\n"),
    };
  }

  return {
    result: true,
    message: "검증 성공",
  };
};
