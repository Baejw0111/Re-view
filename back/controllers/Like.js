import asyncHandler from "../utils/ControllerUtils.js";
import {
  ReviewModel,
  ReviewLikeModel,
  NotificationModel,
  TagModel,
} from "../utils/Model.js";
import { sendEventToClient } from "./Notification.js";

/**
 * 리뷰 추천 API
 */
export const addLike = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;
  const userId = req.userId;

  const review = await ReviewModel.findById(reviewId);

  if (!review) {
    return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
  }

  // 리뷰 추천 데이터 생성
  await ReviewLikeModel.create({
    kakaoId: userId,
    reviewId,
    likedAt: Date.now(),
  });

  await ReviewModel.findByIdAndUpdate(reviewId, {
    $inc: { likesCount: 1 },
  });

  const bulkOps = review.tags.map((tagName) => ({
    updateOne: {
      filter: { tagName, kakaoId: userId },
      update: { $inc: { preference: 3 } },
      upsert: true,
    },
  }));

  await TagModel.bulkWrite(bulkOps);

  // 추천 수 갱신 후 10개가 될 경우 알림 생성
  if (review.likesCount === 9) {
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
 * 리뷰 추천 관련 정보 조회
 */
export const getLikeStatus = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;
  const { kakaoId } = req.query;

  const isLiked = !!(await ReviewLikeModel.exists({ reviewId, kakaoId }));
  const review = await ReviewModel.findById(reviewId);

  return res.json({ isLiked, likesCount: review.likesCount });
}, "리뷰 추천 관련 정보 조회");

/**
 * 리뷰 추천 취소 API
 */
export const unLike = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;
  const userId = req.userId;

  const review = await ReviewModel.findById(reviewId);

  if (!review) {
    return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
  }

  await ReviewLikeModel.findOneAndDelete({
    kakaoId: userId,
    reviewId,
  });

  await ReviewModel.findByIdAndUpdate(reviewId, {
    $inc: { likesCount: -1 },
  });

  await TagModel.updateMany(
    { tagName: { $in: review.tags }, kakaoId: userId },
    { $inc: { preference: -3 } }
  );

  await TagModel.deleteMany({
    kakaoId: userId,
    preference: { $lte: 0 },
  });

  // 추천 수 갱신 후 9개가 될 경우 알림 삭제
  if (review.likesCount === 10) {
    await NotificationModel.findOneAndDelete({ reviewId });

    // 알림 이벤트 전송
    sendEventToClient(review.authorId);
  }

  res.status(200).json({ message: "추천 삭제 완료" });
}, "리뷰 추천 취소");
