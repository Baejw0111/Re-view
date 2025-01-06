import axios from "axios";
import SocialAuth from "./SocialAuth.js";

class KakaoAuth extends SocialAuth {
  constructor(config) {
    super(config);
  }

  async getToken(code) {
    const response = await axios.post(
      this.tokenUrl,
      {
        grant_type: "authorization_code",
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        code: code,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );

    return response.data;
  }

  async verifyToken(accessToken) {
    const response = await axios.get(
      `${this.apiUrl}/v1/user/access_token_info`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }

  async refreshToken(refreshToken) {
    const response = await axios.post(
      this.tokenUrl,
      {
        grant_type: "refresh_token",
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );
    return response.data;
  }

  async getUserInfo(accessToken) {
    const response = await axios.get(`${this.apiUrl}/v2/user/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
    return response.data;
  }

  async logout(accessToken) {
    const response = await axios.post(
      `${this.apiUrl}/v1/user/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }

  async unlink(accessToken) {
    const response = await axios.post(
      `${this.apiUrl}/v1/user/unlink`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }
}

const { KAKAO_CLIENT_ID, KAKAO_CLIENT_SECRET, KAKAO_REDIRECT_URI } =
  process.env;

const kakaoAuth = new KakaoAuth({
  clientId: KAKAO_CLIENT_ID,
  clientSecret: KAKAO_CLIENT_SECRET,
  redirectUri: KAKAO_REDIRECT_URI,
  tokenUrl: "https://kauth.kakao.com/oauth/token",
  apiUrl: "https://kapi.kakao.com",
});

export default kakaoAuth;
