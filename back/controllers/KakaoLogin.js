import axios from "axios";
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
});

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

  return next();
});

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
});

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

  const { nickname, profile_image, thumbnail_image } = response.data.properties;

  return res.status(200).json({
    nickname,
    profileImage: profile_image,
    thumbnailImage: thumbnail_image,
  });
});

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
});
