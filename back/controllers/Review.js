import {
  ReviewModel,
  UserModel,
  CommentModel,
  NotificationModel,
  ReviewLikeModel,
} from "../utils/Model.js";
import { deleteUploadedFiles } from "../utils/Upload.js";
import asyncHandler from "../utils/ControllerUtils.js";
import { increaseTagPreference, decreaseTagPreference } from "./Tag.js";

/**
 * 리뷰 등록
 * @returns {string} 리뷰 등록 성공 메시지
 */
export const createReview = asyncHandler(async (req, res) => {
  const { title, reviewText, rating, tags, isSpoiler } = req.body;
  const authorId = req.userId;
  const tagList = typeof tags === "string" ? [tags] : [...tags];

  console.log(authorId);

  const reviewData = new ReviewModel({
    authorId,
    images: req.files.map((file) => file.path), // 여러 이미지 경로 저장
    title,
    reviewText,
    rating,
    tags: tagList,
    isSpoiler,
  });
  await reviewData.save();

  await increaseTagPreference(authorId, tagList, 5);

  await UserModel.findByIdAndUpdate(authorId, {
    $inc: { reviewCount: 1, totalRating: rating },
  });

  res.status(201).json({
    message: "리뷰가 성공적으로 등록되었습니다.",
  });
}, "리뷰 등록");

/**
 * 최신 리뷰 조회
 * @returns {string[]} 리뷰 ID 리스트
 */
export const getLatestFeed = asyncHandler(async (req, res) => {
  const { lastReviewId } = req.query;

  // 클라이언트에서 마지막으로 받은 리뷰 ID의 업로드 시간을 통해 다음 리뷰 목록 조회
  // 마지막 리뷰 ID가 없으면 처음 요청을 보내는 것이므로, 최근 업로드된 리뷰 20개 조회
  const lastReview =
    lastReviewId === "" ? null : await ReviewModel.findById(lastReviewId);
  const lastReviewUploadTime = lastReview ? lastReview.uploadTime : new Date();

  const reviewList = await ReviewModel.find({
    uploadTime: { $lt: lastReviewUploadTime },
  })
    .sort({ uploadTime: -1 })
    .limit(20);

  const reviewIdList = reviewList.map((review) => review._id);

  res.status(200).json(reviewIdList);
}, "최신 리뷰 조회");

/**
 * 리뷰 검색 결과 조회 API
 * @param {string} query - 검색어
 * @returns {Object[]} 리뷰 검색 결과 배열
 */
export const searchReviews = asyncHandler(async (req, res) => {
  const { query, lastReviewId } = req.query;
  const queryWithoutSpace = query.replace(/\s/g, "");

  const lastReview =
    lastReviewId === "" ? null : await ReviewModel.findById(lastReviewId);
  const lastReviewUploadTime = lastReview ? lastReview.uploadTime : new Date();

  const reviews = await ReviewModel.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { title: { $regex: queryWithoutSpace, $options: "i" } },
      { reviewText: { $regex: query, $options: "i" } },
      { reviewText: { $regex: queryWithoutSpace, $options: "i" } },
      { tags: { $in: [query, queryWithoutSpace] } },
    ],
    uploadTime: { $lt: lastReviewUploadTime },
  })
    .sort({ uploadTime: -1 })
    .limit(20);

  const reviewIdList = reviews.map((review) => review._id);

  res.status(200).json(reviewIdList);
}, "리뷰 검색");

/**
 * 인기 리뷰 조회
 * @returns {string[]} 리뷰 ID 리스트
 */
export const getPopularFeed = asyncHandler(async (req, res) => {
  const { lastReviewId } = req.query;

  const lastReview =
    lastReviewId === "" ? null : await ReviewModel.findById(lastReviewId);
  const lastReviewUploadTime = lastReview ? lastReview.uploadTime : new Date();

  const reviewList = await ReviewModel.find({
    uploadTime: { $lt: lastReviewUploadTime },
    likesCount: { $gte: 10 },
  })
    .sort({ uploadTime: -1 })
    .limit(20);
  const reviewIdList = reviewList.map((review) => review._id);

  res.status(200).json(reviewIdList);
}, "인기 리뷰 조회");

/**
 * 특정 리뷰 조회
 * @returns {ReviewModel} 리뷰 데이터
 */
export const getReviewById = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;
  const reviewData = await ReviewModel.findById(reviewId).populate(
    "authorId",
    "kakaoId"
  );
  if (!reviewData) {
    return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
  }

  console.log(reviewData);

  return res.status(200).json({
    _id: reviewData._id,
    __v: reviewData.__v,
    authorId: reviewData.authorId.kakaoId,
    uploadTime: reviewData.uploadTime,
    title: reviewData.title,
    images: reviewData.images,
    reviewText: reviewData.reviewText,
    rating: reviewData.rating,
    tags: reviewData.tags,
    isSpoiler: reviewData.isSpoiler,
  });
}, "특정 리뷰 조회");

/**
 * 리뷰 수정
 * @returns {string} 리뷰 수정 성공 메시지
 */
export const updateReview = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;

  const reviewData = await ReviewModel.findById(reviewId);
  if (!reviewData) {
    deleteUploadedFiles(req.files.map((file) => file.path));
    return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
  } else if (reviewData.authorId.toString() !== req.userId) {
    deleteUploadedFiles(req.files.map((file) => file.path));
    return res.status(403).json({ message: "리뷰 수정 권한이 없습니다." });
  }

  // 받은 필드만 업데이트
  const updateData = req.body;
  for (let key in updateData) {
    if (key === "deletedImages") {
      continue;
    }

    if (key === "rating") {
      await UserModel.findByIdAndUpdate(req.userId, {
        $inc: { totalRating: updateData.rating - reviewData.rating },
      });
    }

    if (key === "tags") {
      await decreaseTagPreference(req.userId, reviewData.tags, 5);
      await increaseTagPreference(req.userId, updateData.tags, 5);
    }

    reviewData[key] = updateData[key];
  }

  // 새 이미지 파일이 있을 경우 기존 이미지 파일들 삭제 후 경로 업데이트
  if (updateData.deletedImages && updateData.deletedImages.length > 0) {
    deleteUploadedFiles(updateData.deletedImages);

    reviewData.images = reviewData.images.filter(
      (image) => !updateData.deletedImages.includes(image)
    );
  }

  if (req.files && req.files.length > 0) {
    reviewData.images = reviewData.images.concat(
      req.files.map((file) => file.path)
    );
  }

  await reviewData.save();
  res.status(200).json({ message: "리뷰가 성공적으로 수정되었습니다." });
}, "리뷰 수정");

/**
 * 리뷰 삭제
 * @returns {string} 리뷰 삭제 성공 메시지
 */
export const deleteReview = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await ReviewModel.findById(reviewId);
  if (!review) {
    return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
  } else if (review.authorId.toString() !== req.userId) {
    return res.status(403).json({ message: "리뷰 삭제 권한이 없습니다." });
  }

  deleteUploadedFiles(review.images); // 모든 이미지 파일 삭제

  await decreaseTagPreference(review.authorId, review.tags, 5); // 태그 선호도 감소

  await ReviewModel.findByIdAndDelete(reviewId); // 리뷰 삭제
  await CommentModel.deleteMany({ reviewId: reviewId }); // 댓글 삭제
  await NotificationModel.deleteMany({ reviewId: reviewId }); // 알림 삭제
  await ReviewLikeModel.deleteMany({ reviewId: reviewId }); // 추천 삭제
  await UserModel.findByIdAndUpdate(review.authorId, {
    $inc: { reviewCount: -1, totalRating: -review.rating },
  }); // 유저 정보 업데이트

  res.status(200).json({ message: "리뷰가 성공적으로 삭제되었습니다." });
}, "리뷰 삭제");
