import asyncHandler from "../utils/ControllerUtils.js";
import { UserModel } from "../utils/Model.js";
import { deleteUploadedFiles } from "../utils/Upload.js";

/**
 * 유저 정보 조회
 */
export const getUserInfoById = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const user = await UserModel.findOne({ kakaoId: userId });
  res.status(200).json(user);
}, "유저 정보 조회");

/**
 * 유저가 작성한 리뷰 목록 조회
 * @returns {string[]} 리뷰 ID 리스트
 */
export const getUserReviewList = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const user = await UserModel.exists({ kakaoId: userId });
  if (!user) {
    return res.status(404).json({ message: "유저가 존재하지 않습니다." });
  }

  const reviews = await ReviewModel.find({ authorId: userId });
  const reviewIdList = reviews.map((review) => review._id);
  return res.json(reviewIdList);
}, "유저가 작성한 리뷰 ID 리스트 조회");

/**
 * 유저가 작성한 댓글 ID 목록 조회
 * @returns 유저가 작성한 댓글 ID 목록
 */
export const getUserCommentList = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const comments = await CommentModel.find({ authorId: userId });
  const commentIdList = comments.map((comment) => comment._id);
  res.status(200).json(commentIdList);
}, "유저가 작성한 댓글 ID 목록 조회");

/**
 * 유저가 추천한 리뷰 ID 목록 조회 API
 * @returns 유저가 추천한 리뷰 ID 목록
 */
export const getUserLikedList = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const user = await UserModel.exists({ kakaoId: userId });
  if (!user) {
    return res.status(404).json({ message: "유저가 존재하지 않습니다." });
  }

  const likes = await ReviewLikeModel.find({ kakaoId: userId });
  const reviewIdList = likes.map((like) => like.reviewId);
  res.status(200).json(reviewIdList);
}, "유저가 추천한 리뷰 ID 목록 조회");

/**
 * 유저 정보 수정
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
