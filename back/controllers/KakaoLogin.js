import axios from "axios";
import { UserModel, ReviewModel, CommentModel } from "../utils/Model.js";
import asyncHandler from "../utils/ControllerUtils.js";

const { KAKAO_REST_API_KEY, KAKAO_REDIRECT_URI } = process.env;

// 카카오 서버에 토큰 요청 및 클라이언트에 쿠키 설정
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
 * 카카오 토큰 검증
 * next로 다음 미들웨어 호출
 */
export const verifyKakaoAccessToken = asyncHandler(async (req, res, next) => {
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

  console.log(`func: verifyKakaoAccessToken`);
  console.table(response.data);

  req.userId = response.data.id; // 카카오 유저 ID를 요청에 추가해 다음 미들웨어에서 사용할 수 있도록 함
  return next();
}, "카카오 토큰 검증");

// 카카오 액세스 토큰 재발급
export const refreshKakaoAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
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

// 카카오 유저 가입 여부 체크
const checkNewMember = async (userId) => {
  const user = await UserModel.findOne({ kakaoId: userId });

  if (!user) {
    return true;
  }
  return false;
};

// 카카오 유저 정보 조회
export const getKakaoUserInfo = asyncHandler(async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const response = await axios.get(
    "https://kapi.kakao.com/v2/user/me?secure_resource=true",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  );

  console.log(`func: getKakaoUserInfo`);
  console.log(response.data);

  const isNewMember = await checkNewMember(response.data.id);
  console.log(`isNewMember: ${isNewMember}`);

  if (isNewMember) {
    const newMember = new UserModel({
      kakaoId: response.data.id,
      nickname: response.data.properties.nickname,
      thumbnailImage: response.data.properties.thumbnail_image,
      profileImage: response.data.properties.profile_image,
    });
    await newMember.save();
  }

  const { nickname, profile_image, thumbnail_image, custom_nickname } =
    response.data.properties;

  return res.status(200).json({
    isNewMember: isNewMember,
    userInfo: {
      kakaoId: response.data.id,
      nickname: isNewMember ? nickname : custom_nickname,
      profileImage: profile_image,
      thumbnailImage: thumbnail_image,
    },
  });
}, "카카오 유저 정보 조회");

// 카카오 로그아웃
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

// 카카오 유저 닉네임 수정
export const updateKakaoUserNickname = asyncHandler(async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const { newNickname } = req.body;
  const response = await axios.post(
    "https://kapi.kakao.com/v1/user/update_profile",
    {
      properties: JSON.stringify({
        custom_nickname: newNickname,
      }),
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  );

  console.log(`func: updateKakaoUserNickname`);
  console.table(response.data);

  await UserModel.findOneAndUpdate(
    { kakaoId: response.data.id },
    { nickname: newNickname }
  );

  return res.status(200).json({ message: "유저 닉네임 수정 성공" });
}, "카카오 유저 닉네임 수정");

// 카카오 유저 계정 삭제
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

  await UserModel.findOneAndDelete({ kakaoId: response.data.id });
  await ReviewModel.deleteMany({ authorId: response.data.id });
  await CommentModel.deleteMany({ authorId: response.data.id });

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "유저 계정 삭제 성공" });
});
