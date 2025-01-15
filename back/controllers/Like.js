import asyncHandler from "../utils/ControllerUtils.js";
import {
  UserModel,
  ReviewModel,
  ReviewLikeModel,
  NotificationModel,
} from "../utils/Model.js";
import { sendEventToClient } from "./Notification.js";
import { increaseTagPreference, decreaseTagPreference } from "./Tag.js";

/**
 * 리뷰 추천 API
 */
export const addLike = asyncHandler(async (req, res) => {
  const { reviewAliasId } = req.params;
  const userId = req.userId;

  const review = await ReviewModel.findOne({ aliasId: reviewAliasId });

  if (!review) {
    return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
  }

  // 참고: find 보다는 exists가 더 효율적임
  const isLiked = !!(await ReviewLikeModel.exists({
    reviewId: review._id,
    userId,
  }));

  if (!isLiked) {
    // 리뷰 추천 데이터 생성
    await ReviewLikeModel.create({
      userId,
      reviewId: review._id,
      likedAt: Date.now(),
    });

    await ReviewModel.findByIdAndUpdate(review._id, {
      $inc: { likesCount: 1 },
    });

    await increaseTagPreference(userId, review.tags, 3);

    await UserModel.findByIdAndUpdate(userId, {
      $inc: { likedReviewCount: 1 },
    }); // 유저 정보 업데이트

    // 추천 수 갱신 후 10개가 될 경우 알림 생성
    if (review.likesCount === 9) {
      await NotificationModel.create({
        userId: review.authorId,
        reviewId: review._id,
        category: "like",
      });

      // 알림 이벤트 전송
      // sendEventToClient(review.authorId);
    }
  }

  res.status(200).json({ message: "추천 완료!" });
}, "리뷰 추천");

/**
 * 리뷰 추천 수 조회 API
 */
export const getLikeCount = asyncHandler(async (req, res) => {
  const { reviewAliasId } = req.params;

  const review = await ReviewModel.findOne(
    { aliasId: reviewAliasId },
    { likesCount: 1 }
  );

  if (!review) {
    return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
  }

  return res.status(200).json(review.likesCount);
}, "리뷰 추천 수 조회");

/**
 * 사용자의 리뷰 추천 여부 조회 API
 */
export const getUserLiked = asyncHandler(async (req, res) => {
  const { reviewAliasId } = req.params;
  const userId = req.userId;

  const review = await ReviewModel.findOne(
    { aliasId: reviewAliasId },
    { _id: 1 }
  );

  if (!review) {
    return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
  }

  const isLiked = !!(await ReviewLikeModel.exists({
    reviewId: review._id,
    userId: userId,
  }));

  return res.status(200).json(isLiked);
}, "사용자의 리뷰 추천 여부 조회");

/**
 * 리뷰 추천 취소 API
 */
export const unLike = asyncHandler(async (req, res) => {
  const { reviewAliasId } = req.params;
  const userId = req.userId;

  const review = await ReviewModel.findOne({ aliasId: reviewAliasId });

  if (!review) {
    return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
  }

  const isLiked = !!(await ReviewLikeModel.exists({
    reviewId: review._id,
    userId,
  }));

  if (isLiked) {
    await ReviewLikeModel.findOneAndDelete({
      userId,
      reviewId: review._id,
    });

    await ReviewModel.findByIdAndUpdate(review._id, {
      $inc: { likesCount: -1 },
    });

    await decreaseTagPreference(userId, review.tags, 3);

    await UserModel.findByIdAndUpdate(userId, {
      $inc: { likedReviewCount: -1 },
    }); // 유저 정보 업데이트

    // 추천 수 갱신 후 9개가 될 경우 알림 삭제
    if (review.likesCount === 10) {
      await NotificationModel.findOneAndDelete({ reviewId: review._id });

      // 알림 이벤트 전송
      // sendEventToClient(review.authorId);
    }
  }

  res.status(200).json({ message: "추천 삭제 완료" });
}, "리뷰 추천 취소");
