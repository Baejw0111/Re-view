import axios from "axios";
import {
  UserModel,
  ReviewModel,
  CommentModel,
  NotificationModel,
  ReviewLikeModel,
  TagModel,
  IdMapModel,
} from "../utils/Model.js";
import asyncHandler from "../utils/ControllerUtils.js";
import { deleteUploadedFiles } from "../utils/Upload.js";
import { GoogleAuth, NaverAuth, KakaoAuth } from "./SocialAuth/index.js";
import { getUserAliasId } from "../utils/IdGenerator.js";

const { PUUUSH_WEB_HOOK_URL } = process.env;

const authProvider = {
  google: GoogleAuth,
  kakao: KakaoAuth,
  naver: NaverAuth,
};

/**
 * 토큰 요청 및 클라이언트에 쿠키 설정
 */
export const getToken = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const { provider } = req.params;
  const tokenData = await authProvider[provider].getToken(code);
  const { access_token, refresh_token, expires_in, refresh_token_expires_in } =
    tokenData;

  console.table(tokenData);

  // 브라우저에 쿠키 설정
  res.cookie("provider", provider, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: expires_in * 1000, // 엑세스 토큰 유효 기간
  });

  res.cookie("accessToken", access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: expires_in * 1000, // 엑세스 토큰 유효 기간
  });

  // 추후에 DB에 저장하는 로직으로 바꿀 것
  res.cookie("refreshToken", refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: refresh_token_expires_in
      ? refresh_token_expires_in * 1000
      : 7 * 24 * 60 * 60 * 1000, // 리프레시 토큰 유효 기간
  });

  return res.status(200).json({
    message: "토큰 요청 성공",
  });
}, "토큰 요청");

/**
 * 토큰 검증 미들웨어
 */
export const verifyAccessToken = asyncHandler(async (req, res, next) => {
  const { accessToken, provider } = req.cookies;
  if (!accessToken) {
    return res.status(401).json({
      message:
        "액세스 토큰이 만료되었습니다. 로그인하지 않았다면 로그인해주세요.",
    });
  }

  const socialId = await authProvider[provider].verifyToken(accessToken);
  console.table({ socialId });

  const originalSocialId = provider + socialId; // 소셜 로그인 제공자 + 유저 소셜 ID
  const userAliasId = await getUserAliasId(originalSocialId);

  const userInfo = await UserModel.findOne({ aliasId: userAliasId });

  // 유저 소셜 ID와 유저 데이터 고유 ID를 요청에 추가해 다음 미들웨어에서 사용할 수 있도록 함
  req.aliasId = userAliasId;
  req.userId = userInfo?._id; // 유저 데이터 고유 ID. 회원 가입을 하지 않은 경우 빈 값

  return next();
}, "소셜 토큰 검증");

/**
 * 액세스 토큰 재발급
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken, provider } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({ message: "로그인 해주세요." });
  }

  const tokenData = await authProvider[provider].refreshToken(refreshToken);

  console.table(tokenData);

  const { access_token, expires_in, refresh_token, refresh_token_expires_in } =
    tokenData;

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
    });
  }

  if (refresh_token) {
    return res
      .status(200)
      .json({ message: "액세스 토큰, 리프레시 토큰 갱신 성공" });
  }

  return res.status(200).json({ message: "액세스 토큰 갱신 성공" });
}, "소셜 액세스 토큰 재발급");

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
 * 로그인한 유저 정보 조회
 */
export const getLoginUserInfo = asyncHandler(async (req, res) => {
  const { aliasId } = req;
  let userInfo = await UserModel.findOne({ aliasId });

  // 회원 가입을 하지 않은 경우 유저 데이터 생성
  if (!userInfo) {
    userInfo = new UserModel({
      aliasId,
    });
    await userInfo.save();

    const userCount = await UserModel.countDocuments();
    await axios.post(`${PUUUSH_WEB_HOOK_URL}`, {
      title: `신규 유저 가입!`,
      body: `현재까지 총 ${userCount}명의 유저가 가입하였습니다.`,
    });
  }

  return res.status(200).json({
    aliasId: userInfo.aliasId,
    nickname: userInfo.nickname,
    profileImage: userInfo.profileImage,
    notificationCheckTime: userInfo.notificationCheckTime,
  });
}, "소셜 유저 정보 조회");

/**
 * 소셜 로그아웃
 */
export const logOut = asyncHandler(async (req, res) => {
  const { accessToken, provider } = req.cookies;

  // 구글 Oauth의 경우 토큰을 따로 만료시키는 기능이 없음
  if (provider === "kakao") {
    const response = await authProvider[provider].logout(accessToken);

    console.table(response);
  }

  res.clearCookie("provider");
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json({ message: "로그아웃 성공" });
}, "소셜 로그아웃");

/**
 * 소셜 유저 계정 삭제
 */
export const deleteUserAccount = asyncHandler(async (req, res) => {
  const { accessToken, provider } = req.cookies;
  const { aliasId } = req;

  await authProvider[provider].unlink(accessToken); // 소셜 연동 해제

  const user = await UserModel.findOneAndDelete({ aliasId }); // 유저 데이터 삭제 및 반환

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
    await ReviewLikeModel.deleteMany({ reviewId: review._id }); // 리뷰에 달린 추천들 모두 삭제
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
  await IdMapModel.deleteOne({ aliasId: aliasId }); // 유저의 소셜 아이디 맵 삭제

  res.clearCookie("provider");
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json({ message: "유저 계정 삭제 성공" });
}, "소셜 유저 계정 삭제");
