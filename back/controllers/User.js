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

/**
 * 유저 정보 조회
 * @returns {Object[]} 유저 데이터, 상위 4개 선호 태그 리스트
 */
export const getUserInfoById = asyncHandler(async (req, res) => {
  const { id: kakaoId } = req.params;
  const userInfo = await UserModel.findOne({ kakaoId });
  const favoriteTags = await getFavoriteTags(userInfo._id);

  res.status(200).json({
    kakaoId: userInfo.kakaoId,
    nickname: userInfo.nickname,
    profileImage: userInfo.profileImage,
    totalRating: userInfo.totalRating,
    reviewCount: userInfo.reviewCount,
    notificationCheckTime: userInfo.notificationCheckTime,
    favoriteTags: favoriteTags,
  });
}, "유저 정보 조회");

/**
 * 유저 검색 결과 조회 API
 * @param {string} query - 검색어
 * @param {string} lastUserId - 마지막 유저 ID
 * @returns {ObjectId[]} 유저 ID 리스트
 */
export const searchUsers = asyncHandler(async (req, res) => {
  const { query, lastUserKakaoId } = req.query;
  const queryWithoutSpace = query.replace(/\s/g, "");

  const users = await UserModel.find({
    $or: [
      { nickname: { $regex: query, $options: "i" } },
      { nickname: { $regex: queryWithoutSpace, $options: "i" } },
    ],
    kakaoId: { $gt: lastUserKakaoId },
  })
    .sort({ kakaoId: 1 })
    .limit(20);
  const userIdList = users.map((user) => user.kakaoId);

  res.status(200).json(userIdList);
}, "유저 검색");

/**
 * 유저가 작성한 리뷰 목록 조회
 * @returns {string[]} 리뷰 ID 리스트
 */
export const getUserReviewList = asyncHandler(async (req, res) => {
  const { id: kakaoId } = req.params;
  const { lastReviewId } = req.query;

  const user = await UserModel.findOne({ kakaoId });
  if (!user) {
    return res.status(404).json({ message: "유저가 존재하지 않습니다." });
  }

  const lastReviewUploadTime = lastReviewId
    ? (await ReviewModel.findById(lastReviewId))?.uploadTime || new Date()
    : new Date();

  const reviewList = await ReviewModel.find(
    {
      authorId: user._id,
      uploadTime: { $lt: lastReviewUploadTime },
    },
    { _id: 1, uploadTime: 1 } // 필요한 필드만 명시
  )
    .sort({ uploadTime: -1 })
    .limit(20);

  const reviewIdList = reviewList.map((review) => review._id);
  res.status(200).json(reviewIdList);
}, "유저가 작성한 리뷰 목록 조회");

/**
 * 유저가 작성한 댓글 목록 조회
 * @returns {Object[]} 댓글 데이터, 작성자 데이터 리스트
 */
export const getUserCommentList = asyncHandler(async (req, res) => {
  const { id: kakaoId } = req.params;

  const user = await UserModel.findOne({ kakaoId });
  if (!user) {
    return res.status(404).json({ message: "유저가 존재하지 않습니다." });
  }

  // 댓글 목록 조회 및 작성자 정보 함께 가져오기
  const comments = await CommentModel.find({ authorId: user._id });

  // 댓글 목록 생성
  const commentList = comments.map((comment) => ({
    _id: comment._id,
    authorId: comment.authorId,
    profileImage: user.profileImage,
    nickname: user.nickname,
    reviewId: comment.reviewId,
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
  const { id: kakaoId } = req.params;
  const { lastReviewId } = req.query;

  const user = await UserModel.findOne({ kakaoId });
  if (!user) {
    return res.status(404).json({ message: "유저가 존재하지 않습니다." });
  }

  const lastReviewLikedAt = lastReviewId
    ? (
        await ReviewLikeModel.findOne({
          reviewId: lastReviewId,
          userId: user._id,
        })
      )?.likedAt || new Date()
    : new Date();

  const likedList = await ReviewLikeModel.find({
    userId: user._id,
    likedAt: { $lt: lastReviewLikedAt },
  })
    .sort({
      likedAt: -1,
    })
    .limit(20);

  const likedReviewIdList = likedList.map((liked) => liked.reviewId);

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
    kakaoId: user.kakaoId,
    nickname: newNickname,
    profileImage: user.profileImage, // 프로필 이미지 정보 반환
  });
}, "유저 정보 수정");

export const userFeedback = asyncHandler(async (req, res) => {
  const { feedback } = req.body;
  const webhookUrl =
    "https://discord.com/api/webhooks/1321484339594137600/_NtCXyPcP2pCv9_z0HLU9x7jUkc9fNCMoMdzbDiVSgMNk6gv6B0UiKrC9x0E7AvxeYas";

  await axios.post(webhookUrl, {
    username: "운영자",
    content: feedback,
  });
  res.status(200).json({ message: "피드백 전송 완료" });
}, "유저 피드백 전송");
