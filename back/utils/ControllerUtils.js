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
    `\x1b[31m${operation} 중 에러 발생: ${error.message}\nData:${JSON.stringify(
      error.response?.data
    )}\x1b[0m\n`
  );

  if (req.files) {
    deleteUploadedFiles(req.files.map((file) => file.key));
  }

  res.status(500).json({ message: `서버 에러: ${error.message}` });
};

/**
 * 비동기 컨트롤러 래퍼 함수
 * @param {Function} fn - 래핑하는 비동기 함수
 * @param {string} operation - 래핑하는 함수 이름
 * @returns {Function} - 래핑된 함수
 */
const asyncHandler = (fn, operation) => (req, res, next) => {
  console.log(`\x1b[32m실행 작업: ${operation}\x1b[0m`);

  // 400번대 에러 처리
  const originalSend = res.json; // 원래 함수 저장
  res.json = function (body) {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      console.error(
        `\x1b[31m${operation} 작업 중 ${res.statusCode} 에러 발생: ${body.message}\x1b[0m`
      );
    }
    return originalSend.apply(this, arguments); // 원래 함수 실행
  };

  return Promise.resolve(fn(req, res, next)).catch(
    handleError(req, res, operation)
  );
};

export default asyncHandler;
