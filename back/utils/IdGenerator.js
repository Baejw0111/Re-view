import { IdMapModel, ReviewModel, CommentModel } from "./Model.js";

/**
 * 랜덤 문자열 생성
 * @param {number} length - 문자열 길이
 * @returns {string} - 랜덤 문자열
 */
function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

/**
 * 유저 별칭 ID 중복 체크
 * @param {string} aliasId - 유저 별칭 ID
 * @returns {boolean} - 중복 여부
 */
async function checkDuplicateUserAliasId(aliasId) {
  const idMap = await IdMapModel.exists({ aliasId });
  return idMap ? true : false;
}

/**
 * 리뷰 별칭 ID 중복 체크
 * @param {string} aliasId - 리뷰 별칭
 * @returns {boolean} - 중복 여부
 */
async function checkDuplicateReviewAliasId(aliasId) {
  const review = await ReviewModel.exists({ aliasId });
  return review ? true : false;
}

/**
 * 댓글 별칭 ID 중복 체크
 * @param {string} aliasId - 댓글 별칭 ID
 * @returns {boolean} - 중복 여부
 */
async function checkDuplicateCommentAliasId(aliasId) {
  const comment = await CommentModel.exists({ aliasId });
  return comment ? true : false;
}

/**
 * 유저 서비스 ID 생성
 * @returns {string} - 유저 서비스 ID
 */
async function generateUserAliasId() {
  let userAliasId = generateRandomString(8);

  while (await checkDuplicateUserAliasId(userAliasId)) {
    userAliasId = generateRandomString(8);
  }

  return userAliasId;
}

/**
 * 리뷰 별칭 ID 생성
 * @returns {string} - 리뷰 별칭 ID
 */
export async function generateReviewAliasId() {
  let reviewAliasId = generateRandomString(12);

  while (await checkDuplicateReviewAliasId(reviewAliasId)) {
    reviewAliasId = generateRandomString(12);
  }

  return reviewAliasId;
}

/**
 * 댓글 별칭 ID 생성
 * @returns {string} - 댓글 별칭 ID
 */
export async function generateCommentAliasId() {
  let commentAliasId = generateRandomString(16);

  while (await checkDuplicateCommentAliasId(commentAliasId)) {
    commentAliasId = generateRandomString(16);
  }

  return commentAliasId;
}

/**
 * 유저 별칭 ID 반환
 * @param {string} originalSocialId - 소셜 로그인 제공자 이름 + 원본 소셜 아이디 로 이뤄진 문자열
 * @returns {string} - 유저 별칭 ID
 */
export async function getUserAliasId(originalSocialId) {
  const idMap = await IdMapModel.findOne({ originalSocialId });

  // 새로 가입한 유저일 경우 새로 생성
  if (!idMap) {
    const aliasId = await generateUserAliasId();
    await IdMapModel.create({ originalSocialId, aliasId });
    return aliasId;
  }

  // 이미 가입한 유저일 경우 기존 아이디 반환
  return idMap.aliasId;
}
