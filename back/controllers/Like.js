import asyncHandler from "../utils/ControllerUtils.js";
import {
  ReviewModel,
  ReviewLikeModel,
  NotificationModel,
} from "../utils/Model.js";
import { sendEventToClient } from "./Notification.js";

/**
 * 리뷰 추천 API
 */
export const addLike = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;

  const reviewExists = await ReviewModel.exists({ _id: reviewId });

  if (!reviewExists) {
    return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
  }

  // 리뷰 추천 수 증카
  await ReviewModel.findByIdAndUpdate(reviewId, {
    $inc: { likesCount: 1 },
  });

  // 리뷰 추천 데이터 생성
  await ReviewLikeModel.create({
    kakaoId: req.userId,
    reviewId,
    likedAt: Date.now(),
  });

  const review = await ReviewModel.findById(reviewId);

  // 리뷰의 추천 수가 10개가 될 경우 알림 생성
  if (review.likesCount === 10) {
    await NotificationModel.create({
      kakaoId: review.authorId,
      reviewId,
      category: "like",
    });

    // 알림 이벤트 전송
    sendEventToClient(review.authorId);
  }

  res.status(200).json({ message: "추천 완료!" });
}, "리뷰 추천");

/**
 * 유저의 리뷰 추천 여부 조회
 */
export const getIsLiked = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;
  const { kakaoId } = req.query;
  const isLiked = !!(await ReviewLikeModel.exists({ reviewId, kakaoId }));
  return res.json(isLiked);
}, "유저의 리뷰 추천 여부 조회");

/**
 * 리뷰 추천 취소 API
 */
export const unLike = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;
  await ReviewModel.findByIdAndUpdate(reviewId, {
    $inc: { likesCount: -1 },
  });

  await ReviewLikeModel.findOneAndDelete({
    kakaoId: req.userId,
    reviewId,
  });

  res.status(200).json({ message: "추천 삭제 완료" });
}, "리뷰 추천 취소");
