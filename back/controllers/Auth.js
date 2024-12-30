import axios from "axios";
import {
  UserModel,
  ReviewModel,
  CommentModel,
  NotificationModel,
  ReviewLikeModel,
  TagModel,
} from "../utils/Model.js";
import asyncHandler from "../utils/ControllerUtils.js";
import { deleteUploadedFiles } from "../utils/Upload.js";

const { KAKAO_REST_API_KEY, KAKAO_REDIRECT_URI } = process.env;

/**
 * 카카오 토큰 요청 및 클라이언트에 쿠키 설정
 */
export const getKakaoToken = asyncHandler(async (req, res) => {
  const { code } = req.body;
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

  const { access_token, refresh_token, expires_in, refresh_token_expires_in } =
    response.data;

  console.log(`func: getKakaoToken`);
  console.table(response.data);

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
  });
}, "카카오 토큰 요청");

/**
 * 카카오 토큰 검증 미들웨어
 */
export const verifyKakaoAccessToken = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res
      .status(401)
      .json({
        message:
          "액세스 토큰이 만료되었습니다. 로그인하지 않았다면 로그인해주세요.",
      });
  }
  const response = await axios.get(
    "https://kapi.kakao.com/v1/user/access_token_info",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  console.log(`func: verifyKakaoAccessToken`);
  console.table(response.data);

  const kakaoId = response.data.id; // 카카오 유저 ID

  // 유저 DB ID를 요청에 추가해 다음 미들웨어에서 사용할 수 있도록 함
  const userInfo = await UserModel.findOne({ kakaoId });
  req.userId = userInfo?._id;

  return next();
}, "카카오 토큰 검증");

/**
 * 카카오 액세스 토큰 재발급
 */
export const refreshKakaoAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "로그인 해주세요." });
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

  console.log(`func: refreshKakaoAccessToken`);
  console.table(response.data);

  const { access_token, expires_in, refresh_token, refresh_token_expires_in } =
    response.data;

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
}, "카카오 액세스 토큰 재발급");

/**
 * 로그인 여부 확인
 */
export const checkAuth = asyncHandler(async (req, res) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }
  return res.status(200).json({ message: "로그인 상태입니다." });
}, "로그인 여부 확인");

/**
 * 브라우저 캐시 비활성화 미들웨어
 */
export const disableCache = (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
};

/**
 * 카카오 유저 정보 조회
 */
export const getKakaoUserInfo = asyncHandler(async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const response = await axios.get("https://kapi.kakao.com/v2/user/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });

  console.log(`func: getKakaoUserInfo`);
  console.log(response.data);

  let userInfo = await UserModel.findOne({ kakaoId: response.data.id });

  if (!userInfo) {
    userInfo = new UserModel({
      kakaoId: response.data.id,
    });
    await userInfo.save();
  }

  return res.status(200).json({
    kakaoId: userInfo.kakaoId,
    nickname: userInfo.nickname,
    profileImage: userInfo.profileImage,
    totalRating: userInfo.totalRating,
    reviewCount: userInfo.reviewCount,
    notificationCheckTime: userInfo.notificationCheckTime,
  });
}, "카카오 유저 정보 조회");

/**
 * 카카오 로그아웃
 */
export const logOutKakao = asyncHandler(async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const response = await axios.post(
    "https://kapi.kakao.com/v1/user/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  console.log(`func: logOutKakao`);
  console.table(response.data);

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "로그아웃 성공" });
}, "카카오 로그아웃");

/**
 * 카카오 유저 계정 삭제
 */
export const deleteUserAccount = asyncHandler(async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const response = await axios.post(
    "https://kapi.kakao.com/v1/user/unlink",
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded;",
      },
    }
  );

  console.log(`func: deleteUserAccount`);
  console.table(response.data);

  const user = await UserModel.findOneAndDelete({ kakaoId: response.data.id }); // 유저 데이터 삭제 및 반환

  if (!user) {
    return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
  }

  // 리뷰 관련 데이터 모두 삭제
  const reviews = await ReviewModel.find({ authorId: user._id });
  for (const review of reviews) {
    if (review.images) {
      deleteUploadedFiles(review.images);
    }
    await CommentModel.deleteMany({ reviewId: review._id }); // 리뷰에 달린 댓글들 모두 삭제
    await NotificationModel.deleteMany({ reviewId: review._id }); // 리뷰에 달린 알림들 모두 삭제
  }
  await ReviewModel.deleteMany({ authorId: user._id });

  // 댓글 관련 데이터 모두 삭제
  const comments = await CommentModel.find({ authorId: user._id });
  for (const comment of comments) {
    await NotificationModel.deleteMany({ commentId: comment._id }); // 댓글에 달린 알림들 모두 삭제
  }
  await CommentModel.deleteMany({ authorId: user._id });

  await NotificationModel.deleteMany({ userId: user._id }); // 유저의 알림들 모두 삭제
  await ReviewLikeModel.deleteMany({ userId: user._id }); // 유저의 추천들 모두 삭제
  await TagModel.deleteMany({ userId: user._id }); // 유저의 태그들 모두 삭제

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "유저 계정 삭제 성공" });
}, "카카오 유저 계정 삭제");
