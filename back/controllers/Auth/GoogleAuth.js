import axios from "axios";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } =
  process.env;

export default class GoogleAuth {
  // 구글 인증 요청 URL
  static oauthUrl = "https://oauth2.googleapis.com";

  // 구글 API URL
  static apiUrl = "https://www.googleapis.com";

  /**
   * 구글 토큰 요청
   * @param {string} code 구글 인증 코드
   * @returns 토큰 정보
   */
  static async getToken(code) {
    const response = await axios.post(
      `${this.oauthUrl}/token`,
      {
        grant_type: "authorization_code",
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
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

  /**
   * 구글 엑세스 토큰 검증
   * @param {string} accessToken 구글 엑세스 토큰
   * @returns 유저 정보
   */
  static async verifyToken(accessToken) {
    const response = await axios.get(`${this.apiUrl}/oauth2/v2/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    return response.data;
  }

  /**
   * 구글 엑세스 토큰 재발급
   * @param {string} refreshToken 구글 리프레시 토큰
   * @returns 토큰 정보
   */
  static async refreshToken(refreshToken) {
    const response = await axios.post(
      `${this.oauthUrl}/token`,
      {
        grant_type: "refresh_token",
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
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

  /**
   * 구글 연동 해제
   * @param {string} accessToken 구글 엑세스 토큰
   * @returns 연동 해제한 회원의 id
   */
  static async unlink(accessToken) {
    await axios.post(
      `${this.oauthUrl}/revoke`,
      { token: accessToken },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );
  }
}
