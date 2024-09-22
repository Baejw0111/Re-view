import fs from "fs"; // 파일 삭제용
import { ReviewModel, UserModel, CommentModel } from "../utils/Model.js";
import { upload } from "../utils/upload.js";
import asyncHandler from "../utils/ControllerUtils.js";

// 리뷰 전체 조회
export const getReviewIdList = asyncHandler(async (req, res) => {
  const reviewList = await ReviewModel.find();
  const reviewIdList = reviewList.map((review) => review._id);

  return res.json(reviewIdList);
}, "리뷰 ID 리스트 조회");

// 특정 리뷰 조회
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
  reviewDataWithLike.isLikedByUser = user.likedReviews.includes(reviewData._id);

  res.status(200).json(reviewDataWithLike);
}, "특정 리뷰 조회");

// 리뷰 등록
export const createReview = asyncHandler(async (req, res) => {
  // 여러 파일 업로드를 위해 'array' 메소드 사용
  // 리뷰 등록에 문제가 있을 시 이미지가 서버에 저장되는 것을 막기 위해 multer 미들웨어를 수동으로 처리
  const uploader = upload.array("images", 5); // 최대 5개 파일 업로드 가능

  // 파일 업로드 처리
  await new Promise((resolve, reject) => {
    uploader(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

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
    req.files.length === 0
  ) {
    // 업로드된 파일이 있다면 모두 삭제
    if (req.files) {
      req.files.forEach((file) => fs.unlinkSync(file.path));
    }
    return res
      .status(400)
      .json({ message: "모든 필드를 채워주세요.", req: req.body });
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

// 리뷰 수정
export const updateReview = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;
  const uploader = upload.array("images", 5);

  await new Promise((resolve, reject) => {
    uploader(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  const reviewData = await ReviewModel.findById(reviewId);
  if (!reviewData) {
    return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
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
  updateData.deletedImages.forEach((imagePath) => fs.unlinkSync(imagePath));

  reviewData.images = reviewData.images.filter(
    (image) => !updateData.deletedImages.includes(image)
  );

  if (req.files && req.files.length > 0) {
    reviewData.images = reviewData.images.concat(
      req.files.map((file) => file.path)
    );
  }

  await reviewData.save();
  res.status(200).json({ message: "리뷰가 성공적으로 수정되었습니다." });
}, "리뷰 수정");

// 리뷰 삭제
export const deleteReview = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await ReviewModel.findById(reviewId);
  if (!review) {
    return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
  }

  if (review.images) {
    review.images.forEach((imagePath) => fs.unlinkSync(imagePath)); // 모든 이미지 파일 삭제
  }

  await ReviewModel.findByIdAndDelete(reviewId); // 리뷰 삭제
  await UserModel.findOneAndUpdate(
    { kakaoId: review.authorId },
    { $pull: { reviews: reviewId.toString() } }
  ); // 유저 정보 업데이트
  await CommentModel.deleteMany({ reviewId: reviewId.toString() }); // 댓글 삭제

  res.status(200).json({ message: "리뷰가 성공적으로 삭제되었습니다." });
}, "리뷰 삭제");
