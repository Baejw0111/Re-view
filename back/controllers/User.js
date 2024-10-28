import asyncHandler from "../utils/ControllerUtils.js";
import {
  UserModel,
  ReviewModel,
  CommentModel,
  ReviewLikeModel,
} from "../utils/Model.js";
import { deleteUploadedFiles } from "../utils/Upload.js";

/**
 * 유저 정보 조회
 * @returns {UserModel} 유저 데이터
 */
export const getUserInfoById = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const userInfo = await UserModel.findOne({ kakaoId: userId });
  const reviewCount = await ReviewModel.countDocuments({ authorId: userId });
  const commentCount = await CommentModel.countDocuments({ authorId: userId });
  const likedReviewCount = await ReviewLikeModel.countDocuments({
    kakaoId: userId,
  });
  res
    .status(200)
    .json({ userInfo, reviewCount, commentCount, likedReviewCount });
}, "유저 정보 조회");

/**
 * 유저가 작성한 리뷰 목록 조회
 * @returns {string[]} 리뷰 ID 리스트
 */
export const getUserReviewList = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const { lastReviewId } = req.query;

  const user = await UserModel.exists({ kakaoId: userId });
  if (!user) {
    return res.status(404).json({ message: "유저가 존재하지 않습니다." });
  }

  const lastReview =
    lastReviewId === "" ? null : await ReviewModel.findById(lastReviewId);
  const lastReviewUploadTime = lastReview ? lastReview.uploadTime : new Date();

  const reviewList = await ReviewModel.find({
    authorId: userId,
    uploadTime: { $lt: lastReviewUploadTime },
  })
    .sort({ uploadTime: -1 })
    .limit(20);

  const reviewIdList = reviewList.map((review) => review._id);
  res.status(200).json(reviewIdList);
}, "유저가 작성한 리뷰 목록 조회");

/**
 * 유저가 작성한 댓글 목록 조회
 * @returns {CommentModel[]} 댓글 데이터 리스트
 */
export const getUserCommentList = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const comments = await CommentModel.find({ authorId: userId });
  const commentList = await Promise.all(
    comments.map(async (comment) => {
      const user = await UserModel.findOne({ kakaoId: comment.authorId });

      return {
        _id: comment._id,
        authorId: comment.authorId,
        profileImage: user.profileImage,
        nickname: user.nickname,
        reviewId: comment.reviewId,
        uploadTime: comment.uploadTime,
        content: comment.content,
      };
    })
  );
  res.status(200).json(commentList);
}, "유저가 작성한 댓글 목록 조회");

/**
 * 유저가 추천한 리뷰 목록 조회
 * @returns {string[]} 리뷰 ID 리스트
 */
export const getUserLikedList = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const { lastReviewId } = req.query;

  const user = await UserModel.exists({ kakaoId: userId });
  if (!user) {
    return res.status(404).json({ message: "유저가 존재하지 않습니다." });
  }

  const lastReview =
    lastReviewId === ""
      ? null
      : await ReviewLikeModel.findOne({
          reviewId: lastReviewId,
          kakaoId: userId,
        });
  const lastReviewLikedAt = lastReview ? lastReview.likedAt : new Date();

  const likedList = await ReviewLikeModel.find({
    kakaoId: userId,
    likedAt: { $lt: lastReviewLikedAt },
  })
    .sort({
      likedAt: -1,
    })
    .limit(20);

  const reviewList = await Promise.all(
    likedList.map(async (liked) => {
      return await ReviewModel.findById(liked.reviewId);
    })
  );

  const reviewIdList = reviewList.map((review) => review._id);
  res.status(200).json(reviewIdList);
}, "유저가 추천한 리뷰 목록 조회");

/**
 * 유저 정보 수정
 * @returns {UserModel} 수정된 유저 데이터
 */
export const updateUserInfo = asyncHandler(async (req, res) => {
  const { newNickname, useDefaultProfile } = req.body; // 기본 프로필 사용 여부 추가
  const kakaoId = req.userId;

  const userInfo = await UserModel.findOne({ kakaoId });
  if (!userInfo) {
    deleteUploadedFiles(req.file.path);
    return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
  } else if (userInfo.kakaoId !== kakaoId) {
    deleteUploadedFiles(req.file.path);
    return res.status(403).json({ message: "유저 정보 수정 권한이 없습니다." });
  }

  if (useDefaultProfile.toLowerCase() === "true") {
    // 기본 프로필 사용 시
    if (userInfo.profileImage !== "") {
      deleteUploadedFiles([userInfo.profileImage]);
    }
    userInfo.profileImage = ""; // 프로필 이미지 필드를 빈 문자열로 설정
  } else if (req.file) {
    // 사용자 지정 프로필 사용 시
    if (userInfo.profileImage !== "") {
      deleteUploadedFiles([userInfo.profileImage]);
    }
    userInfo.profileImage = req.file.path; // 업로드된 파일 경로 저장
  }

  userInfo.nickname = newNickname;
  await userInfo.save();

  return res.status(200).json({
    message: "유저 정보 수정 성공",
    kakaoId: kakaoId,
    nickname: newNickname,
    profileImage: userInfo.profileImage, // 프로필 이미지 정보 반환
  });
}, "유저 정보 수정");
