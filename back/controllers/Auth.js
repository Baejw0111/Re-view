import axios from "axios";
import {
  UserModel,
  ReviewModel,
  CommentModel,
  NotificationModel,
  AgreementModel,
  ReviewLikeModel,
  TagModel,
  IdMapModel,
} from "../utils/Model.js";
import asyncHandler from "../utils/ControllerUtils.js";
import { deleteUploadedFiles } from "../utils/Upload.js";
import { GoogleAuth, NaverAuth, KakaoAuth } from "./SocialAuth/index.js";
import { generateUserAliasId } from "../utils/IdGenerator.js";

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

  const userIdentifier = provider + socialId; // 소셜 로그인 제공자 + 유저 소셜 ID
  const idMap = await IdMapModel.findOne({
    originalSocialId: { $in: [userIdentifier] },
  });
  const userInfo = await UserModel.findOne({ aliasId: idMap?.aliasId });

  req.userIdentifier = userIdentifier;
  req.aliasId = idMap?.aliasId; // 유저 별칭 ID. 회원 가입을 하지 않은 경우 빈 값
  req.userId = userInfo?._id; // 유저 데이터 고유 ID. 회원 가입을 하지 않은 경우 빈 값

  if (userInfo?.nickname === "운영자") {
    req.role = "admin";
  } else {
    req.role = "user";
  }

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
 * 소셜 계정 연동 정보 조회
 */
export const getSocialProvidersInfo = asyncHandler(async (req, res) => {
  const { aliasId } = req;
  const socialProviders = await IdMapModel.findOne({ aliasId });
  const providers = { naver: false, kakao: false, google: false };

  if (!socialProviders) {
    return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
  }

  // IdMapModel의 originalSocialId 배열을 순회하며 소셜 로그인 연동 정보 추출
  for (const socialId of socialProviders.originalSocialId) {
    for (const provider in providers) {
      if (socialId.startsWith(provider)) {
        providers[provider] = true;
        break;
      }
    }
  }

  return res.status(200).json(providers);
}, "소셜 로그인 연동 정보 조회");

/**
 * 소셜 로그인 추가 연동
 */
export const addSocialProvider = asyncHandler(async (req, res) => {
  const { provider } = req.params;
  const { code } = req.body;
  const { access_token } = await authProvider[provider].getToken(code);
  const { aliasId } = req;

  // 토큰을 통해 소셜 로그인 정보 조회
  const socialId = await authProvider[provider].verifyToken(access_token);
  console.table({ socialId });

  const userIdentifier = provider + socialId; // 소셜 로그인 제공자 + 유저 소셜 ID
  const idMap = await IdMapModel.findOne({ aliasId });

  if (idMap) {
    if (idMap.originalSocialId.includes(userIdentifier)) {
      return res.status(409).json({ message: "이미 연동된 플랫폼입니다." });
    }
    idMap.originalSocialId.push(userIdentifier);
    await idMap.save();
  } else {
    return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
  }

  return res.status(200).json({ message: "소셜 로그인 연동 성공" });
}, "소셜 로그인 연동");

/**
 * 소셜 로그인 연동 해제
 */
export const deleteSocialProvider = asyncHandler(async (req, res) => {
  const { provider } = req.params;
  const { aliasId } = req;
  const idMap = await IdMapModel.findOne({ aliasId });

  if (!idMap) {
    return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
  }

  if (!idMap.originalSocialId.includes(provider)) {
    return res.status(409).json({ message: "연동된 플랫폼이 아닙니다." });
  }

  if (idMap.originalSocialId.length === 1) {
    return res
      .status(400)
      .json({ message: "최소 하나의 플랫폼은 연동되어 있어야 합니다." });
  }

  idMap.originalSocialId = idMap.originalSocialId.filter(
    (socialId) => !socialId.startsWith(provider)
  );
  await idMap.save();

  return res.status(200).json({ message: "소셜 로그인 연동 해제 성공" });
}, "소셜 로그인 연동 해제");

/**
 * 회원 가입
 */
export const signUp = asyncHandler(async (req, res) => {
  const { userIdentifier } = req;
  const { newNickname, useDefaultProfile } = req.body; // 기본 프로필 사용 여부 추가
  const { termVersion, privacyVersion } = req.query;

  if (newNickname === "운영자") {
    return res
      .status(400)
      .json({ message: `"운영자"는 사용할 수 없는 닉네임입니다.` });
  }

  const userExists = await IdMapModel.findOne({
    originalSocialId: { $in: [userIdentifier] },
  });

  if (userExists) {
    return res.status(409).json({ message: "이미 가입된 유저입니다." });
  }

  const aliasId = await generateUserAliasId();

  await IdMapModel.create({ originalSocialId: [userIdentifier], aliasId });
  const userInfo = new UserModel({
    aliasId,
  });

  if (useDefaultProfile.toLowerCase() === "true") {
    // 기본 프로필 사용 시
    userInfo.profileImage = ""; // 프로필 이미지 필드를 빈 문자열로 설정
  } else if (req.file) {
    // 사용자 지정 프로필 사용 + 프로필 이미지 업로드 시
    userInfo.profileImage = req.file.key; // 업로드된 파일 경로 저장
  }

  userInfo.nickname = newNickname;
  await userInfo.save();

  await AgreementModel.create({
    userId: userInfo._id,
    termVersion,
    termAgreementTime: Date.now(),
    privacyVersion,
    privacyAgreementTime: Date.now(),
  });

  const userCount = await UserModel.countDocuments();
  await axios.post(`${PUUUSH_WEB_HOOK_URL}`, {
    title: `신규 유저 가입!`,
    body: `현재까지 총 ${userCount}명의 유저가 가입하였습니다.`,
  });

  return res.status(200).json({
    message: "회원 가입 성공",
  });
}, "회원 가입");

/**
 * 회원 가입 취소
 */
export const cancelSignUp = asyncHandler(async (req, res) => {
  const { accessToken, provider } = req.cookies;

  await authProvider[provider].unlink(accessToken); // 소셜 연동 해제

  res.clearCookie("provider");
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res.status(200).json({ message: "회원 가입 취소 성공" });
}, "회원 가입 취소");

export const updateTermsAgreement = asyncHandler(async (req, res) => {
  const { userId } = req;
  const { termVersion, privacyVersion } = req.body;

  await AgreementModel.findOneAndUpdate(
    { userId: userId }, // 검색 조건
    {
      termVersion,
      privacyVersion,
      termAgreementTime: Date.now(),
      privacyAgreementTime: Date.now(),
    },
    {
      new: true, // 업데이트된 문서 반환
      upsert: true, // 문서가 없으면 새로 생성
    }
  );

  return res.status(200).json({ message: "약관 동의 업데이트 성공" });
}, "약관 동의 업데이트");

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
  const { userId } = req;
  const userInfo = await UserModel.findById(userId);

  if (!userInfo) {
    return res.status(200).json({ isSignedUp: false });
  }

  const agreement = await AgreementModel.findOne({ userId });

  return res.status(200).json({
    isSignedUp: true,
    aliasId: userInfo.aliasId,
    nickname: userInfo.nickname,
    profileImage: userInfo.profileImage,
    notificationCheckTime: userInfo.notificationCheckTime,
    agreedTermVersion: agreement?.termVersion,
    agreedPrivacyVersion: agreement?.privacyVersion,
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

const deleteUserData = async (user, userIdentifier) => {
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

  await IdMapModel.deleteOne({ aliasId: user.aliasId }); // 유저의 소셜 아이디 맵 삭제
  await NotificationModel.deleteMany({ userId: user._id }); // 유저의 알림들 모두 삭제
  await ReviewLikeModel.deleteMany({ userId: user._id }); // 유저의 추천들 모두 삭제
  await TagModel.deleteMany({ userId: user._id }); // 유저의 태그들 모두 삭제
  await AgreementModel.deleteOne({ userId: user._id }); // 유저의 약관 동의 데이터 삭제
};

/**
 * 회원 탈퇴
 */
export const deleteUserAccount = asyncHandler(async (req, res) => {
  const { accessToken, provider } = req.cookies;
  const { userId, aliasId } = req;

  await authProvider[provider].unlink(accessToken); // 소셜 연동 해제

  const user = await UserModel.findByIdAndDelete(userId); // 유저 데이터 삭제 및 반환

  if (!user) {
    return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
  }

  await deleteUserData(user, aliasId);

  res.clearCookie("provider");
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json({ message: "회원 탈퇴 성공" });
}, "회원 탈퇴");

/**
 * 관리자 권한 강제 유저 계정 삭제
 */
export const adminDeleteUserAccount = asyncHandler(async (req, res) => {
  const { aliasId } = req.params;
  const { role } = req;

  if (role !== "admin") {
    return res.status(403).json({ message: "관리자 권한이 없습니다." });
  }

  const user = await UserModel.findOneAndDelete({ aliasId });
  if (!user) {
    return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
  }

  await deleteUserData(user, aliasId);

  res.status(200).json({ message: "관리자 권한 강제 유저 계정 삭제 성공" });
}, "관리자 권한 강제 유저 계정 삭제");
