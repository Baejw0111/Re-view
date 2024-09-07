/**
 * 공통 에러 처리 함수
 * @param {Response} res - 응답 객체
 * @param {string} operation - 작업 이름
 * @param {Error} error - 발생한 에러
 * @returns {void}
 */
const handleError = (res, operation) => (error) => {
  console.error(
    `${operation} 중 에러 발생: ${error.message}\n`,
    error.response?.data
  );
  res
    .status(500)
    .json({ message: "서버 에러가 발생했습니다.", error: error.message });
};

/**
 * 비동기 컨트롤러 래퍼 함수
 * @param {Function} fn - 비동기 함수
 * @returns {Function} - 래퍼 함수
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(handleError(res, fn.name));

export default asyncHandler;
