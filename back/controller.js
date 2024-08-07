// 비즈니스 로직 코드

import multer from "multer"; // 파일 업로드용
import path from "path"; // 파일 경로 설정용
import fs from "fs"; // 파일 삭제용
import { ReviewModel } from "./model.js";

// 파일 업로드 처리
const upload = multer({
  storage: multer.diskStorage({
    // 파일 저장 위치 설정
    destination: function (req, file, cb) {
      cb(null, path.join("public"));
    },
    // 파일 이름 설정
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname); // 파일 확장자 추출
      const originalName = path.basename(file.originalname, ext); // 파일 이름 추출
      cb(null, path.join(originalName + Date.now() + ext)); // 파일 이름 설정
    },
  }),
});

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

// 특정 리뷰 조회

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
  // 리뷰 등록에 문제가 있을 시 이미지가 서버에 저장되는 것을 막기 위해 multer 미들웨어를 수동으로 처리
  const uploader = upload.single("image");

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
      !req.file
    ) {
      // 이미지 파일이 이미 업로드되었다면 삭제
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res
        .status(400)
        .json({ message: "모든 필드를 채워주세요.", req: req.body });
    }

    try {
      const reviewData = new ReviewModel({
        author,
        image: req.file.path,
        uploadTime,
        title,
        reviewText,
        rating,
        tags,
      });
      await reviewData.save();
      res.status(201).json({ message: "리뷰가 성공적으로 등록되었습니다." });
    } catch (error) {
      console.error("리뷰 등록 중 에러 발생:", error);
      res.status(500).json({ message: "서버 에러가 발생했습니다." });
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
  const uploader = upload.single("image"); // 이미지 파일을 처리

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
      const updateData = req.body; // 클라이언트로부터 받은 업데이트할 데이터
      for (let key in updateData) {
        reviewData[key] = updateData[key];
      }

      // 이미지 파일이 있을 경우 기존 이미지 파일 삭제 후 경로 업데이트
      if (req.file) {
        if (reviewData.image) {
          fs.unlinkSync(reviewData.image); // 기존 이미지 파일 삭제
        }
        reviewData.image = req.file.path; // 새 이미지 파일 경로로 업데이트
      }

      await reviewData.save(); // 수정된 데이터 저장
      res.status(200).json({ message: "리뷰가 성공적으로 수정되었습니다." });
    } catch (error) {
      console.error("리뷰 수정 중 에러 발생:", error);
      res.status(500).json({ message: "서버 에러가 발생했습니다." });
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
    if (review.image) {
      fs.unlinkSync(review.image); // 이미지 파일 삭제
    }
    await ReviewModel.findByIdAndDelete(id);
    res.status(200).json({ message: "리뷰가 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("리뷰 삭제 중 에러 발생:", error);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
};
