import axios from "axios";

const { NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, NAVER_REDIRECT_URI } =
  process.env;

export default class GoogleAuth {
  // 네이버 토큰 요청 URL
  static tokenUrl = "https://nid.naver.com/oauth2.0/token";

  // 네이버 API URL
  static apiUrl = "https://openapi.naver.com/v1/nid/me";

  /**
   * 네이버 토큰 요청
   * @param {string} code 네이버 인증 코드
   * @returns 토큰 정보
   */
  static async getToken(code) {
    const response = await axios.post(
      `${this.tokenUrl}`,
      {
        grant_type: "authorization_code",
        client_id: NAVER_CLIENT_ID,
        client_secret: NAVER_CLIENT_SECRET,
        redirect_uri: NAVER_REDIRECT_URI,
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
   * 네이버 엑세스 토큰 검증
   * @param {string} accessToken 네이버 엑세스 토큰
   * @returns 유저 정보
   */
  static async verifyToken(accessToken) {
    const response = await axios.get(`${this.apiUrl}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    return response.data.response;
  }

  /**
   * 네이버 엑세스 토큰 재발급
   * @param {string} refreshToken 네이버 리프레시 토큰
   * @returns 토큰 정보
   */
  static async refreshToken(refreshToken) {
    const response = await axios.post(
      `${this.tokenUrl}`,
      {
        grant_type: "refresh_token",
        client_id: NAVER_CLIENT_ID,
        client_secret: NAVER_CLIENT_SECRET,
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
   * 네이버 연동 해제
   * @param {string} accessToken 네이버 엑세스 토큰
   * @returns 연동 해제한 회원의 id
   */
  static async unlink(accessToken) {
    await axios.post(
      `${this.tokenUrl}`,
      {
        grant_type: "delete",
        client_id: NAVER_CLIENT_ID,
        client_secret: NAVER_CLIENT_SECRET,
        access_token: accessToken,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );
  }
}
