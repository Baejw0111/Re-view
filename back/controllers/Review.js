import {
  ReviewModel,
  UserModel,
  CommentModel,
  NotificationModel,
  ReviewLikeModel,
} from "../utils/Model.js";
import { deleteUploadedFiles } from "../utils/Upload.js";
import asyncHandler from "../utils/ControllerUtils.js";

/**
 * 홈 피드에 표시될 리뷰 조회
 * @returns {string[]} 리뷰 ID 리스트
 */
export const getFeed = asyncHandler(async (req, res) => {
  const reviewList = await ReviewModel.find();
  const reviewIdList = reviewList.map((review) => review._id);

  return res.json(reviewIdList);
}, "리뷰 ID 리스트 조회");

/**
 * 특정 리뷰 조회
 * @returns {ReviewModel} 리뷰 데이터
 */
export const getReviewsById = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;
  const { kakaoId } = req.query;
  const reviewData = await ReviewModel.findById(reviewId);
  if (!reviewData) {
    return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
  }

  // 유저가 존재하지 않을 경우 리뷰 데이터만 반환
  const user = await UserModel.findOne({ kakaoId });
  if (!user) {
    return res.status(200).json(reviewData);
  }

  // 유저가 존재할 경우 리뷰 데이터에 현재 로그인한 유저의 추천 여부 추가
  const reviewDataWithLike = reviewData.toObject();
  reviewDataWithLike.isLikedByUser = await ReviewLikeModel.exists({
    kakaoId,
    reviewId,
  });

  res.status(200).json(reviewDataWithLike);
}, "특정 리뷰 조회");

/**
 * 리뷰 등록 시 필드 검증
 * @param {string} title
 * @param {string} reviewText
 * @param {number} rating
 * @param {string[]} tags
 * @param {File[]} files
 */
const verifyFormFields = (title, reviewText, rating, tags, files) => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const validExtensions = ["jpg", "jpeg", "png", "webp"];

  if (title.length > 20) return false; // 제목 길이 검증
  if (reviewText.length > 1000) return false; // 리뷰 길이 검증
  if (rating < 0 || rating > 5) return false; // 평점 값 검증
  if (tags.length > 5) return false; // 태그 개수 검증
  if (files.length > 5) return false; // 이미지 개수 검증
  if (files.some((file) => file.size > MAX_FILE_SIZE)) return false; // 이미지 크기 검증

  // 파일 확장자 검증
  const isInvalidExtension = files.some((file) => {
    const extension = file.originalname.split(".").pop().toLowerCase();
    return !validExtensions.includes(extension);
  });
  if (isInvalidExtension) return false;

  return true;
};

/**
 * 리뷰 등록
 * @returns {string} 리뷰 등록 성공 메시지
 */
export const createReview = asyncHandler(async (req, res) => {
  const authorId = req.userId;

  // 필드 검증
  const { uploadTime, title, reviewText, rating, tags } = req.body;
  if (
    !uploadTime ||
    !title ||
    !reviewText ||
    !rating ||
    !tags ||
    !req.files ||
    req.files.length === 0 ||
    !verifyFormFields(title, reviewText, rating, tags, req.files)
  ) {
    // 업로드된 파일이 있다면 모두 삭제
    deleteUploadedFiles(req.files.map((file) => file.path));
    return res.status(400).json({
      message: "입력된 데이터에 문제가 있습니다.",
      req: req.body,
      files: req.files,
    });
  }

  const reviewData = new ReviewModel({
    authorId,
    images: req.files.map((file) => file.path), // 여러 이미지 경로 저장
    uploadTime,
    title,
    reviewText,
    rating,
    tags,
    likes: 0,
    comments: 0,
  });
  await reviewData.save();

  await UserModel.findOneAndUpdate(
    { kakaoId: authorId },
    { $push: { reviews: reviewData._id } }
  );

  res.status(201).json({ message: "리뷰가 성공적으로 등록되었습니다." });
}, "리뷰 등록");

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
  } else if (reviewData.authorId !== req.userId) {
    deleteUploadedFiles(req.files.map((file) => file.path));
    return res.status(403).json({ message: "리뷰 수정 권한이 없습니다." });
  }

  // 필드 검증
  const { title, reviewText, rating, tags } = req.body;
  if (
    !verifyFormFields(
      title || reviewData.title,
      reviewText || reviewData.reviewText,
      rating || reviewData.rating,
      tags || reviewData.tags,
      req.files || []
    )
  ) {
    deleteUploadedFiles(req.files.map((file) => file.path));
    return res
      .status(400)
      .json({ message: "입력된 데이터에 문제가 있습니다." });
  }

  // 받은 필드만 업데이트
  const updateData = req.body;
  for (let key in updateData) {
    if (key === "deletedImages") {
      continue;
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
  } else if (review.authorId !== req.userId) {
    return res.status(403).json({ message: "리뷰 삭제 권한이 없습니다." });
  }

  deleteUploadedFiles(review.images); // 모든 이미지 파일 삭제

  await ReviewModel.findByIdAndDelete(reviewId); // 리뷰 삭제
  await UserModel.findOneAndUpdate(
    { kakaoId: review.authorId },
    { $pull: { reviews: reviewId.toString() } }
  ); // 유저 정보 업데이트
  await CommentModel.deleteMany({ reviewId: reviewId.toString() }); // 댓글 삭제
  await NotificationModel.deleteMany({ reviewId: reviewId.toString() }); // 알림 삭제

  res.status(200).json({ message: "리뷰가 성공적으로 삭제되었습니다." });
}, "리뷰 삭제");
