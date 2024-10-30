import asyncHandler from "../utils/ControllerUtils.js";
import {
  CommentModel,
  ReviewModel,
  NotificationModel,
  UserModel,
} from "../utils/Model.js";
import { sendEventToClient } from "./Notification.js";

/**
 * 리뷰 댓글 추가
 */
export const addComment = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;
  const authorId = req.userId;

  const review = await ReviewModel.findById(reviewId);

  if (!review) {
    return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
  }

  // 댓글 생성
  const comment = await CommentModel.create({
    authorId,
    reviewId,
    content: req.body.comment,
  });

  // 알림 생성
  await NotificationModel.create({
    kakaoId: review.authorId,
    commentId: comment._id,
    reviewId,
    category: "comment",
  });

  // 새로운 댓글 이벤트 전송
  sendEventToClient(review.authorId);

  res.status(200).json({ message: "댓글 추가 완료" });
}, "리뷰 댓글 추가");

/**
 * 리뷰 댓글 수 조회
 */
export const getCommentCount = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;

  const reviewExists = await ReviewModel.exists({ _id: reviewId });

  if (!reviewExists) {
    return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
  }

  const commentCount = await CommentModel.countDocuments({ reviewId });
  res.status(200).json(commentCount);
}, "리뷰 댓글 수 조회");

/**
 * 특정 댓글 조회
 */
export const getCommentById = asyncHandler(async (req, res) => {
  const { id: commentId } = req.params;
  const comment = await CommentModel.findById(commentId);
  res.status(200).json(comment);
}, "특정 댓글 조회");

/**
 * 리뷰 댓글 목록 조회
 * @returns 리뷰 댓글 목록
 */
export const getReviewCommentList = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;
  const comments = await CommentModel.find({ reviewId });
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
}, "리뷰 댓글 목록 조회");

/**
 * 리뷰 댓글 삭제 API
 */
export const deleteComment = asyncHandler(async (req, res) => {
  const { id: commentId } = req.params;

  const comment = await CommentModel.findById(commentId);

  if (!comment) {
    return res.status(404).json({ message: "댓글이 존재하지 않습니다." });
  }

  await CommentModel.findByIdAndDelete(commentId); // 댓글 삭제
  await NotificationModel.findOneAndDelete({ commentId }); // 알림 삭제

  // 알림 이벤트 전송
  const review = await ReviewModel.findById(comment.reviewId);
  sendEventToClient(review.authorId);

  res.status(200).json({ message: "댓글 삭제 완료" });
}, "리뷰 댓글 삭제");
