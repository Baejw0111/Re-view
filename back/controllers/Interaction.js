import { CommentModel, UserModel, ReviewModel } from "../utils/Model.js";
import asyncHandler from "../utils/ControllerUtils.js";

// 유저 정보 조회
export const fetchUserInfoById = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const user = await UserModel.findOne({ kakaoId: userId });
  res.status(200).json(user);
}, "유저 정보 조회");

// 댓글 조회
export const getComments = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;
  const comments = await CommentModel.find({ reviewId });
  res.status(200).json(comments);
}, "댓글 조회");

// 추천 추가
export const addLike = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;
  await ReviewModel.findByIdAndUpdate(reviewId, {
    $inc: { likesCount: 1 },
  });
  await UserModel.findOneAndUpdate(
    { kakaoId: req.userId },
    {
      $push: { likedReviews: reviewId },
    }
  );
  res.status(200).json({ message: "추천 완료!" });
}, "리뷰 추천");

// 댓글 추가
export const addComment = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;
  const authorId = req.userId;
  await CommentModel.create({
    authorId,
    reviewId,
    content: req.body.comment,
  });
  await ReviewModel.findByIdAndUpdate(reviewId, {
    $inc: { commentsCount: 1 },
  });
  res.status(200).json({ message: "댓글 추가 완료" });
}, "리뷰 댓글 추가");

// 추천 삭제
export const unLike = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;
  await ReviewModel.findByIdAndUpdate(reviewId, {
    $inc: { likesCount: -1 },
  });
  await UserModel.findOneAndUpdate(
    { kakaoId: req.userId },
    {
      $pull: { likedReviews: reviewId },
    }
  );
  res.status(200).json({ message: "추천 삭제 완료" });
}, "리뷰 추천 취소");

// 댓글 삭제
export const deleteComment = asyncHandler(async (req, res) => {
  const { id: commentId } = req.params;
  const { reviewId } = await CommentModel.findById(commentId);
  await CommentModel.findByIdAndDelete(commentId);
  await ReviewModel.findByIdAndUpdate(reviewId, {
    $inc: { commentsCount: -1 },
  });
  res.status(200).json({ message: "댓글 삭제 완료" });
}, "리뷰 댓글 삭제");
