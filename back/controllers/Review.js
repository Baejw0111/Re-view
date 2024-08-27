import fs from "fs"; // 파일 삭제용
import { ReviewModel } from "../utils/model.js";
import { upload } from "../utils/upload.js";

/**
 * 리뷰 전체 조회
 * @param {*} req 요청
 * @param {*} res 응답
 * @returns 리뷰 전체 조회 결과
 */
export const getReviews = async (req, res) => {
  try {
    const reviews = await ReviewModel.find();
    res.json(reviews);
  } catch (error) {
    console.error("리뷰 조회 중 에러 발생:", error);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
};

/**
 * 특정 리뷰 조회
 * @param {*} req 요청
 * @param {*} res 응답
 * @returns 특정 리뷰 조회 결과
 */
export const getReviewsById = async (req, res) => {
  const { id } = req.params;
  try {
    const reviewData = await ReviewModel.findById(id);
    if (!reviewData) {
      return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
    }
    res.json(reviewData);
  } catch (error) {
    console.error("리뷰 조회 중 에러 발생:", error);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
};

/**
 * 리뷰 등록
 * @param {*} req 요청
 * @param {*} res 응답
 * @returns 리뷰 등록 결과
 */
export const createReview = async (req, res) => {
  // 여러 파일 업로드를 위해 'array' 메소드 사용
  // 리뷰 등록에 문제가 있을 시 이미지가 서버에 저장되는 것을 막기 위해 multer 미들웨어를 수동으로 처리
  const uploader = upload.array("images", 5); // 최대 5개 파일 업로드 가능

  uploader(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "파일 업로드 중 에러 발생", error: err });
    }

    // 필드 검증
    const { author, uploadTime, title, reviewText, rating, tags } = req.body;
    if (
      !author ||
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

    try {
      const reviewData = new ReviewModel({
        author,
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
      res.status(201).json({ message: "리뷰가 성공적으로 등록되었습니다." });
    } catch (error) {
      console.error("리뷰 등록 중 에러 발생:", error);
      res
        .status(500)
        .json({ message: "서버 에러가 발생했습니다.", error: error });
    }
  });
};

/**
 * 리뷰 수정
 * @param {*} req 요청
 * @param {*} res 응답
 * @returns 리뷰 수정 결과
 */
export const updateReview = async (req, res) => {
  const { id } = req.params;
  const uploader = upload.array("images", 5); // 여러 이미지 파일 처리

  uploader(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "이미지 업로드 중 에러 발생", error: err });
    }

    try {
      const reviewData = await ReviewModel.findById(id);
      if (!reviewData) {
        return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
      }

      // 받은 필드만 업데이트
      const updateData = req.body;
      for (let key in updateData) {
        reviewData[key] = updateData[key];
      }

      // 새 이미지 파일이 있을 경우 기존 이미지 파일들 삭제 후 경로 업데이트
      if (req.files && req.files.length > 0) {
        if (reviewData.images) {
          reviewData.images.forEach((imagePath) => fs.unlinkSync(imagePath));
        }
        reviewData.images = req.files.map((file) => file.path);
      }

      await reviewData.save();
      res.status(200).json({ message: "리뷰가 성공적으로 수정되었습니다." });
    } catch (error) {
      console.error("리뷰 수정 중 에러 발생:", error);
      res
        .status(500)
        .json({ message: "서버 에러가 발생했습니다.", error: error });
    }
  });
};

/**
 * 리뷰 삭제
 * @param {*} req 요청
 * @param {*} res 응답
 * @returns 리뷰 삭제 결과
 */
export const deleteReview = async (req, res) => {
  const { id } = req.params;
  try {
    const review = await ReviewModel.findById(id);
    if (!review) {
      return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
    }
    if (review.images) {
      review.images.forEach((imagePath) => fs.unlinkSync(imagePath)); // 모든 이미지 파일 삭제
    }
    await ReviewModel.findByIdAndDelete(id);
    res.status(200).json({ message: "리뷰가 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("리뷰 삭제 중 에러 발생:", error);
    res
      .status(500)
      .json({ message: "서버 에러가 발생했습니다.", error: error });
  }
};
