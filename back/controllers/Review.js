import {
  ReviewModel,
  UserModel,
  CommentModel,
  NotificationModel,
  ReviewLikeModel,
} from "../utils/Model.js";
import {
  deleteUploadedFiles,
  checkFormFieldsExistence,
  verifyFormFields,
} from "../utils/Upload.js";
import asyncHandler from "../utils/ControllerUtils.js";

/**
 * 리뷰 등록
 * @returns {string} 리뷰 등록 성공 메시지
 */
export const createReview = asyncHandler(async (req, res) => {
  const authorId = req.userId;

  // 필드 검증
  const { title, reviewText, rating, tags } = req.body;

  const checkFields = checkFormFieldsExistence(
    title,
    reviewText,
    rating,
    tags,
    req.files
  );

  if (!checkFields.result) {
    deleteUploadedFiles(req.files.map((file) => file.path));

    return res.status(400).json({
      message: checkFields.message,
      req: req.body,
      files: req.files,
    });
  }

  const verifyResult = verifyFormFields(
    title,
    reviewText,
    rating,
    tags,
    req.files
  );

  if (!verifyResult.result) {
    deleteUploadedFiles(req.files.map((file) => file.path));

    return res.status(400).json({
      message: verifyResult.message,
      req: req.body,
      files: req.files,
    });
  }

  const reviewData = new ReviewModel({
    authorId,
    images: req.files.map((file) => file.path), // 여러 이미지 경로 저장
    uploadTime: new Date(),
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
export const getReviewsById = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;
  const reviewData = await ReviewModel.findById(reviewId);
  if (!reviewData) {
    return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
  }

  return res.status(200).json(reviewData);
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
  } else if (reviewData.authorId !== req.userId) {
    deleteUploadedFiles(req.files.map((file) => file.path));
    return res.status(403).json({ message: "리뷰 수정 권한이 없습니다." });
  }

  // 필드 검증
  const { title, reviewText, rating, tags } = req.body;
  const verifyResult = verifyFormFields(
    title,
    reviewText,
    rating,
    tags,
    req.files
  );

  if (!verifyResult.result) {
    deleteUploadedFiles(req.files.map((file) => file.path));
    return res.status(400).json({
      message: verifyResult.message,
      req: req.body,
      files: req.files,
    });
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
  await ReviewLikeModel.deleteMany({ reviewId: reviewId.toString() }); // 추천 삭제

  res.status(200).json({ message: "리뷰가 성공적으로 삭제되었습니다." });
}, "리뷰 삭제");
