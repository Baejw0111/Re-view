// 비즈니스 로직 코드

import multer from "multer"; // 파일 업로드용
import path from "path"; // 파일 경로 설정용
import fs from "fs"; // 파일 삭제용
import { ReviewModel } from "./model.js";
import axios from "axios";

const { KAKAO_REST_API_KEY, KAKAO_REDIRECT_URI } = process.env;

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
 * 카카오 토큰 요청 및 쿠키 설정
 * @param {*} req 요청
 * @param {*} res 응답
 * @returns 카카오 토큰
 */
export const getKakaoToken = async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      {
        grant_type: "authorization_code",
        client_id: KAKAO_REST_API_KEY,
        redirect_uri: KAKAO_REDIRECT_URI,
        code: code,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );

    const {
      access_token,
      refresh_token,
      expires_in,
      refresh_token_expires_in,
    } = response.data;

    console.log(expires_in);
    console.log(refresh_token_expires_in);

    // 브라우저에 쿠키 설정
    res.cookie("accessToken", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: expires_in * 1000, // 엑세스 토큰 유효 기간
    });

    res.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: refresh_token_expires_in * 1000, // 리프레시 토큰 유효 기간
    });

    return res.status(200).json({
      message: "토큰 요청 성공",
      access_token: access_token,
      refresh_token: refresh_token, // 추후에 지울 것
    });
  } catch (error) {
    console.error("토큰 요청 실패:", error);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
};

/**
 * 토큰 검증
 * @param {*} req 요청
 * @param {*} res 응답
 * @param {*} next 다음 미들웨어 호출
 * @returns 토큰 검증 결과
 */
export const verifyKakaoAccessToken = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({ message: "액세스 토큰이 만료되었습니다." });
    }
    const response = await axios.get(
      "https://kapi.kakao.com/v1/user/access_token_info",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log(response.data);

    return next();
  } catch (error) {
    console.log("토큰 검증 중 에러 발생:", error);
    throw error;
  }
};

/**
 * 카카오 액세스 토큰 재발급
 * @param {*} req 요청
 * @param {*} res 응답
 * @returns 카카오 액세스 토큰 재발급 결과
 */
export const refreshKakaoAccessToken = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    console.log(accessToken, refreshToken);
    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "리프레시 토큰이 존재하지 않습니다." });
    }

    const response = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      {
        grant_type: "refresh_token",
        client_id: KAKAO_REST_API_KEY,
        refresh_token: refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );

    console.log(response.data);

    const {
      access_token,
      expires_in,
      refresh_token,
      refresh_token_expires_in,
    } = response.data;

    res.cookie("accessToken", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: expires_in * 1000,
    });

    // 리프레시 토큰도 갱신된 경우
    if (refresh_token) {
      res.cookie("refreshToken", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: refresh_token_expires_in * 1000,
      });
    }

    if (refresh_token) {
      return res
        .status(200)
        .json({ message: "액세스 토큰, 리프레시 토큰 갱신 성공" });
    }

    return res.status(200).json({ message: "액세스 토큰 갱신 성공" });
  } catch (error) {
    console.error("카카오 액세스 토큰 갱신 중 에러 발생:", error);
    res
      .status(500)
      .json({ message: "서버 에러가 발생했습니다.", error: error });
  }
};

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
    if (review.images) {
      review.images.forEach((imagePath) => fs.unlinkSync(imagePath)); // 모든 이미지 파일 삭제
    }
    await ReviewModel.findByIdAndDelete(id);
    res.status(200).json({ message: "리뷰가 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("리뷰 삭제 중 에러 발생:", error);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
};
