import asyncHandler from "../utils/ControllerUtils.js";
import {
  CommentModel,
  ReviewModel,
  NotificationModel,
  UserModel,
} from "../utils/Model.js";
import { sendEventToClient } from "./Notification.js";
import { increaseTagPreference, decreaseTagPreference } from "./Tag.js";
import { generateCommentAliasId } from "../utils/IdGenerator.js";

/**
 * 리뷰 댓글 추가
 */
export const addComment = asyncHandler(async (req, res) => {
  const { reviewAliasId } = req.params;
  const authorId = req.userId;

  const review = await ReviewModel.findOne({ aliasId: reviewAliasId });

  if (!review) {
    return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
  }

  const commentAliasId = await generateCommentAliasId();

  // 댓글 생성
  const comment = await CommentModel.create({
    aliasId: commentAliasId,
    authorId,
    reviewId: review._id,
    content: req.body.comment,
  });

  // 리뷰 댓글 수 증가
  await ReviewModel.findByIdAndUpdate(review._id, {
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
      reviewId: review._id,
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
  const { reviewAliasId } = req.params;

  const review = await ReviewModel.findOne(
    { aliasId: reviewAliasId },
    { commentsCount: 1 }
  );

  if (!review) {
    return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
  }

  res.status(200).json(review.commentsCount);
}, "리뷰 댓글 수 조회");

/**
 * 특정 댓글 조회
 */
export const getCommentById = asyncHandler(async (req, res) => {
  const { commentAliasId } = req.params;
  const comment = await CommentModel.findOne({ aliasId: commentAliasId })
    .populate("authorId", "aliasId, profileImage, nickname")
    .populate("reviewId", "aliasId");

  res.status(200).json({
    aliasId: comment.aliasId,
    authorId: comment.authorId.aliasId,
    profileImage: comment.authorId.profileImage,
    nickname: comment.authorId.nickname,
    reviewId: comment.reviewId.aliasId,
    uploadTime: comment.uploadTime,
    content: comment.content,
  });
}, "특정 댓글 조회");

/**
 * 리뷰 댓글 목록 조회
 * @returns 리뷰 댓글 목록
 */
export const getReviewCommentList = asyncHandler(async (req, res) => {
  const { reviewAliasId } = req.params;

  const review = await ReviewModel.findOne({ aliasId: reviewAliasId });

  if (!review) {
    return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
  }

  // 댓글 목록 조회 및 작성자 정보 함께 가져오기
  const comments = await CommentModel.find({ reviewId: review._id })
    .populate("authorId", "aliasId profileImage nickname")
    .populate("reviewId", "aliasId");

  // 댓글 목록 생성
  const commentList = comments.map((comment) => ({
    aliasId: comment.aliasId,
    authorId: comment.authorId.aliasId,
    profileImage: comment.authorId.profileImage,
    nickname: comment.authorId.nickname,
    reviewId: comment.reviewId.aliasId,
    uploadTime: comment.uploadTime,
    content: comment.content,
  }));

  res.status(200).json(commentList);
}, "리뷰 댓글 목록 조회");

/**
 * 리뷰 댓글 삭제 API
 */
export const deleteComment = asyncHandler(async (req, res) => {
  const { commentAliasId } = req.params;
  const { userId, role } = req;

  const comment = await CommentModel.findOne({ aliasId: commentAliasId });

  if (!comment) {
    return res.status(404).json({ message: "댓글이 존재하지 않습니다." });
  } else if (role !== "admin" && !userId.equals(comment.authorId)) {
    return res.status(403).json({ message: "댓글 삭제 권한이 없습니다." });
  }

  await CommentModel.findByIdAndDelete(comment._id); // 댓글 삭제
  await NotificationModel.findOneAndDelete({ commentId: comment._id }); // 알림 삭제
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
