import axios from "axios";
import asyncHandler from "../utils/ControllerUtils.js";
import {
  UserModel,
  ReviewModel,
  CommentModel,
  ReviewLikeModel,
} from "../utils/Model.js";
import { deleteUploadedFiles } from "../utils/Upload.js";
import { getFavoriteTags } from "./Tag.js";

const {
  IMG_SRC,
  FRONT_URL,
  DISCORD_FEEDBACK_WEB_HOOK_URL,
  DISCORD_REPORT_WEB_HOOK_URL,
} = process.env;

/**
 * 유저 정보 조회
 * @returns {Object[]} 유저 데이터, 상위 4개 선호 태그 리스트
 */
export const getUserInfoById = asyncHandler(async (req, res) => {
  const { userAliasId } = req.params;
  const userInfo = await UserModel.findOne({ aliasId: userAliasId });
  const favoriteTags = await getFavoriteTags(userInfo._id);

  res.status(200).json({
    aliasId: userInfo.aliasId,
    nickname: userInfo.nickname,
    profileImage: userInfo.profileImage,
    totalRating: userInfo.totalRating,
    reviewCount: userInfo.reviewCount,
    favoriteTags: favoriteTags,
  });
}, "유저 정보 조회");

/**
 * 유저 검색 결과 목록 조회
 * @param {string} query - 검색어
 * @param {string} lastUserAliasId - 이전 검색 결과의 마지막 유저 소셜 아이디
 * @returns {string[]} 유저 소셜 아이디 리스트
 */
export const searchUsers = asyncHandler(async (req, res) => {
  const { query, lastUserAliasId } = req.query;
  const queryWithoutSpace = query.replace(/\s/g, "");

  const users = await UserModel.find({
    $or: [
      { nickname: { $regex: query, $options: "i" } }, // 대소문자 구분 없이 검색
      { nickname: { $regex: queryWithoutSpace, $options: "i" } }, // 공백 제거 후 검색
    ],
    aliasId: { $gt: lastUserAliasId }, // 이전 검색 결과의 마지막 유저 별칭 아이디보다 큰 유저 별칭 아이디 검색
  })
    .sort({ aliasId: 1 }) // 유저 별칭 아이디 오름차순 정렬
    .limit(20); // 최대 20개 검색
  const userIdList = users.map((user) => user.aliasId);

  res.status(200).json(userIdList);
}, "유저 검색");

/**
 * 유저가 작성한 리뷰 목록 조회
 * @returns {string[]} 리뷰 ID 리스트
 */
export const getUserReviewList = asyncHandler(async (req, res) => {
  const { userAliasId } = req.params;
  const { lastReviewId: lastReviewAliasId } = req.query;

  const user = await UserModel.findOne({ aliasId: userAliasId });
  if (!user) {
    return res.status(404).json({ message: "유저가 존재하지 않습니다." });
  }

  const lastReviewUploadTime = lastReviewAliasId
    ? (await ReviewModel.findOne({ aliasId: lastReviewAliasId }))?.uploadTime ||
      new Date()
    : new Date();

  const reviewList = await ReviewModel.find(
    {
      authorId: user._id,
      uploadTime: { $lt: lastReviewUploadTime }, // 마지막 리뷰 업로드 시간보다 이전인 리뷰 검색
    },
    { aliasId: 1, uploadTime: 1 } // 필요한 필드만 명시
  )
    .sort({ uploadTime: -1 }) // 업로드 시간 내림차순 정렬
    .limit(20); // 최대 20개 검색

  const reviewIdList = reviewList.map((review) => review.aliasId);
  res.status(200).json(reviewIdList);
}, "유저가 작성한 리뷰 목록 조회");

/**
 * 유저가 작성한 댓글 목록 조회
 * @returns {Object[]} 댓글 데이터, 작성자 데이터 리스트
 */
export const getUserCommentList = asyncHandler(async (req, res) => {
  const { userAliasId } = req.params;

  const user = await UserModel.findOne({ aliasId: userAliasId });

  if (!user) {
    return res.status(404).json({ message: "유저가 존재하지 않습니다." });
  }

  // 댓글 목록 조회 및 작성자 정보 함께 가져오기
  const comments = await CommentModel.find({ authorId: user._id }).populate(
    "reviewId",
    "aliasId"
  );

  // 댓글 목록 생성
  const commentList = comments.map((comment) => ({
    aliasId: comment.aliasId,
    authorId: user.aliasId,
    profileImage: user.profileImage,
    nickname: user.nickname,
    reviewId: comment.reviewId.aliasId,
    uploadTime: comment.uploadTime,
    content: comment.content,
  }));

  res.status(200).json(commentList);
}, "유저가 작성한 댓글 목록 조회");

/**
 * 유저가 추천한 리뷰 목록 조회
 * @returns {string[]} 리뷰 ID 리스트
 */
export const getUserLikedList = asyncHandler(async (req, res) => {
  const { userAliasId } = req.params;
  const { lastReviewId: lastReviewAliasId } = req.query;

  const user = await UserModel.findOne({ aliasId: userAliasId });
  if (!user) {
    return res.status(404).json({ message: "유저가 존재하지 않습니다." });
  }

  // 마지막 리뷰 추천 시간 조회
  const lastReviewLikedAt = lastReviewAliasId
    ? (
        await ReviewLikeModel.findOne({
          reviewId: lastReviewAliasId,
          userId: user._id,
        })
      )?.likedAt || new Date()
    : new Date();

  // 추천 목록 조회
  const likedList = await ReviewLikeModel.find({
    userId: user._id,
    likedAt: { $lt: lastReviewLikedAt }, // 마지막 리뷰 추천 시간보다 이전인 추천 검색
  })
    .populate("reviewId", "aliasId") // 리뷰 데이터 조회
    .sort({
      likedAt: -1, // 추천 시간 내림차순 정렬
    })
    .limit(20); // 최대 20개 검색

  const likedReviewIdList = likedList.map((liked) => liked.reviewId.aliasId);

  res.status(200).json(likedReviewIdList);
}, "유저가 추천한 리뷰 목록 조회");

/**
 * 유저 정보 수정
 * @returns {UserModel} 수정된 유저 데이터
 */
export const updateUserInfo = asyncHandler(async (req, res) => {
  const { newNickname, useDefaultProfile } = req.body; // 기본 프로필 사용 여부 추가
  const userId = req.userId;

  const user = await UserModel.findById(userId); // 유저 찾기

  if (!user) {
    if (req.file) {
      deleteUploadedFiles([req.file.key]);
    }
    return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
  } else if (!userId.equals(user._id)) {
    if (req.file) {
      deleteUploadedFiles([req.file.key]);
    }
    return res.status(403).json({ message: "유저 정보 수정 권한이 없습니다." });
  }

  if (useDefaultProfile.toLowerCase() === "true") {
    // 기본 프로필 사용 시
    if (user.profileImage !== "") {
      deleteUploadedFiles([user.profileImage]);
    }
    user.profileImage = ""; // 프로필 이미지 필드를 빈 문자열로 설정
  } else if (req.file) {
    // 사용자 지정 프로필 사용 + 프로필 이미지 업로드 시
    if (user.profileImage !== "") {
      deleteUploadedFiles([user.profileImage]);
    }
    user.profileImage = req.file.key; // 업로드된 파일 경로 저장
  }

  user.nickname = newNickname;
  await user.save();

  return res.status(200).json({
    message: "유저 정보 수정 성공",
    aliasId: user.aliasId,
    nickname: newNickname,
    profileImage: user.profileImage, // 프로필 이미지 정보 반환
  });
}, "유저 정보 수정");

/**
 * 유저 피드백 전송
 * @returns {Object} 피드백 전송 결과
 */
export const userFeedback = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const user = await UserModel.findById(userId);
  const { feedback } = req.body;
  const webhookUrl = DISCORD_FEEDBACK_WEB_HOOK_URL;

  await axios.post(webhookUrl, {
    username: `${user.nickname}(${user.aliasId})`,
    avatar_url: user.profileImage
      ? `${IMG_SRC}${encodeURIComponent(user.profileImage)}`
      : "",
    content: feedback,
  });
  res.status(200).json({ message: "피드백 전송 완료" });
}, "유저 피드백 전송");

/**
 * 리뷰 신고 전송
 * @returns {Object} 신고 전송 결과
 */
export const userReportReview = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const user = await UserModel.findById(userId);
  const { reportedReviewId } = req.body;
  const webhookUrl = DISCORD_REPORT_WEB_HOOK_URL;

  await axios.post(webhookUrl, {
    username: `${user.nickname}(${user.aliasId})`,
    avatar_url: user.profileImage
      ? `${IMG_SRC}${encodeURIComponent(user.profileImage)}`
      : "",
    content: `${FRONT_URL}/?reviewId=${reportedReviewId}`,
  });
});

/**
 * 댓글 신고 전송
 * @returns {Object} 신고 전송 결과
 */
export const userReportComment = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const user = await UserModel.findById(userId);
  const { reportedReviewId, reportedCommentId } = req.body;
  const webhookUrl = DISCORD_REPORT_WEB_HOOK_URL;

  await axios.post(webhookUrl, {
    username: `${user.nickname}(${user.aliasId})`,
    avatar_url: user.profileImage
      ? `${IMG_SRC}${encodeURIComponent(user.profileImage)}`
      : "",
    content: `${FRONT_URL}/?reviewId=${reportedReviewId}#${reportedCommentId}`,
  });
});
