import axios from "axios";

const { KAKAO_REST_API_KEY, KAKAO_REDIRECT_URI } = process.env;

/**
 * 카카오 서버에 토큰 요청 및 쿠키 설정
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
    });
  } catch (error) {
    console.error("토큰 요청 실패:", error);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
};

/**
 * 카카오 토큰 검증
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
 * 카카오 유저 정보 조회
 * @param {*} req 요청
 * @param {*} res 응답
 * @returns 카카오 유저 정보 조회 결과
 */
export const getKakaoUserInfo = async (req, res) => {
  try {
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

    const { nickname, profile_image, thumbnail_image } =
      response.data.properties;

    return res.status(200).json({
      nickname,
      profileImage: profile_image,
      thumbnailImage: thumbnail_image,
    });
  } catch (error) {
    console.error("카카오 유저 정보 조회 중 에러 발생:", error);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
};

export const logOutKakao = async (req, res) => {
  try {
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

    console.log(response.data);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "로그아웃 성공" });
  } catch (error) {
    console.error("카카오 로그아웃 중 에러 발생:", error);
    res
      .status(500)
      .json({ message: "서버 에러가 발생했습니다.", error: error });
  }
};
