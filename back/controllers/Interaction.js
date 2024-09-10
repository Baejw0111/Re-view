import { ReviewModel, CommentModel, UserModel } from "../utils/Model.js";
import asyncHandler from "../utils/ControllerUtils.js";

// 유저 정보 조회
export const fetchUserInfoById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findOne({ kakaoId: id });
  res.status(200).json(user);
}, "유저 정보 조회");

// 추천수 조회
export const getLikes = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { likesCount } = await ReviewModel.findById(id);
  res.status(200).json({ likesCount });
}, "추천수 조회");

// 댓글 조회
export const getComments = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const comments = await CommentModel.find({ reviewId: id });
  res.status(200).json(comments);
});

// 추천 추가
export const addLike = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await ReviewModel.findByIdAndUpdate(id, {
    $inc: { likesCount: 1 },
  });
  res.status(200).json("추천 완료!");
}, "리뷰 추천");

// 댓글 추가
export const addComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const authorId = req.userId;
  const comment = new CommentModel({
    authorId,
    reviewId: id,
    content: req.body.comment,
  });
  await comment.save();
  res.status(200).json({ message: "댓글 추가 완료" });
}, "리뷰 댓글 추가");

// 추천 삭제
export const cancelLike = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await ReviewModel.findByIdAndUpdate(id, { $inc: { likesCount: -1 } });
  res.status(200).json({ message: "추천 삭제 완료" });
}, "리뷰 추천 취소");

// 댓글 삭제
export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  await CommentModel.findOneAndDelete({
    reviewId: id,
    content,
  });
  res.status(200).json({ message: "댓글 삭제 완료" });
}, "리뷰 댓글 삭제");
