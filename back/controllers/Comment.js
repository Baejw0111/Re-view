import asyncHandler from "../utils/ControllerUtils.js";
import {
  CommentModel,
  ReviewModel,
  NotificationModel,
  UserModel,
} from "../utils/Model.js";
import { sendEventToClient } from "./Notification.js";
import { increaseTagPreference, decreaseTagPreference } from "./Tag.js";

/**
 * 리뷰 댓글 추가
 */
export const addComment = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
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

  // 리뷰 댓글 수 증가
  await ReviewModel.findByIdAndUpdate(reviewId, {
    $inc: { commentsCount: 1 },
  });

  // 태그 선호도 증가
  await increaseTagPreference(authorId, review.tags, 1);

  // 유저 정보 업데이트
  await UserModel.findByIdAndUpdate(authorId, {
    $inc: { commentCount: 1 },
  });

  // 알림 생성
  if (!review.authorId.equals(authorId)) {
    await NotificationModel.create({
      userId: review.authorId,
      commentId: comment._id,
      reviewId,
      category: "comment",
    });
  }

  // 새로운 댓글 이벤트 전송
  // sendEventToClient(review.authorId);

  res.status(200).json({ message: "댓글 추가 완료" });
}, "리뷰 댓글 추가");

/**
 * 리뷰 댓글 수 조회
 */
export const getCommentCount = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const review = await ReviewModel.findById(reviewId);

  if (!review) {
    return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
  }

  res.status(200).json(review.commentsCount);
}, "리뷰 댓글 수 조회");

/**
 * 특정 댓글 조회
 */
export const getCommentById = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const comment = await CommentModel.findById(commentId).populate(
    "authorId",
    "aliasId"
  );

  res.status(200).json({
    _id: comment._id,
    authorId: comment.authorId.aliasId,
    profileImage: comment.authorId.profileImage,
    nickname: comment.authorId.nickname,
    reviewId: comment.reviewId,
    uploadTime: comment.uploadTime,
    content: comment.content,
  });
}, "특정 댓글 조회");

/**
 * 리뷰 댓글 목록 조회
 * @returns 리뷰 댓글 목록
 */
export const getReviewCommentList = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  // 댓글 목록 조회 및 작성자 정보 함께 가져오기
  const comments = await CommentModel.find({ reviewId }).populate(
    "authorId",
    "aliasId profileImage nickname"
  );

  // 댓글 목록 생성
  const commentList = comments.map((comment) => ({
    _id: comment._id,
    authorId: comment.authorId.aliasId,
    profileImage: comment.authorId.profileImage,
    nickname: comment.authorId.nickname,
    reviewId: comment.reviewId,
    uploadTime: comment.uploadTime,
    content: comment.content,
  }));

  res.status(200).json(commentList);
}, "리뷰 댓글 목록 조회");

/**
 * 리뷰 댓글 삭제 API
 */
export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await CommentModel.findById(commentId);

  if (!comment) {
    return res.status(404).json({ message: "댓글이 존재하지 않습니다." });
  }

  await CommentModel.findByIdAndDelete(commentId); // 댓글 삭제
  await NotificationModel.findOneAndDelete({ commentId }); // 알림 삭제
  await ReviewModel.findByIdAndUpdate(comment.reviewId, {
    $inc: { commentsCount: -1 },
  }); // 리뷰 댓글 수 감소

  const review = await ReviewModel.findById(comment.reviewId);

  // 알림 이벤트 전송
  // sendEventToClient(review.authorId);

  await decreaseTagPreference(comment.authorId, review.tags, 1);

  await UserModel.findByIdAndUpdate(comment.authorId, {
    $inc: { commentCount: -1 },
  }); // 유저 정보 업데이트

  res.status(200).json({ message: "댓글 삭제 완료" });
}, "리뷰 댓글 삭제");
