import { deleteUploadedFiles } from "./Upload.js";
/**
 * 공통 에러 처리 함수
 * @param {Response} res - 응답 객체
 * @param {string} operation - 함수 이름
 * @param {Error} error - 발생한 에러
 * @returns {void}
 */
const handleError = (req, res, operation) => (error) => {
  console.error(
    `${operation} 중 에러 발생: ${error.message}\n`,
    error.response?.data
  );

  if (req.files) {
    deleteUploadedFiles(req.files.map((file) => file.path));
  }

  res
    .status(500)
    .json({ message: "서버 에러가 발생했습니다.", error: error.message });
};

/**
 * 비동기 컨트롤러 래퍼 함수
 * @param {Function} fn - 래핑하는 비동기 함수
 * @param {string} operation - 래핑하는 함수 이름
 * @returns {Function} - 래핑된 함수
 */
const asyncHandler = (fn, operation) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(handleError(req, res, operation));

export default asyncHandler;
