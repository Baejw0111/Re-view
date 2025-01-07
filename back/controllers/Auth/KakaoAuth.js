import axios from "axios";

const { KAKAO_CLIENT_ID, KAKAO_CLIENT_SECRET, KAKAO_REDIRECT_URI } =
  process.env;

export default class KakaoAuth {
  // 카카오 토큰 요청 URL
  static tokenUrl = "https://kauth.kakao.com/oauth/token";

  // 카카오 API URL
  static apiUrl = "https://kapi.kakao.com";

  /**
   * 카카오 토큰 요청
   * @param {string} code 카카오 인증 코드
   * @returns 토큰 정보
   */
  static async getToken(code) {
    const response = await axios.post(
      this.tokenUrl,
      {
        grant_type: "authorization_code",
        client_id: KAKAO_CLIENT_ID,
        client_secret: KAKAO_CLIENT_SECRET,
        redirect_uri: KAKAO_REDIRECT_URI,
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
   * 카카오 엑세스 토큰 검증
   * @param {string} accessToken 카카오 엑세스 토큰
   * @returns 카카오 엑세스 토큰 정보
   */
  static async verifyToken(accessToken) {
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

  /**
   * 카카오 엑세스 토큰 재발급
   * @param {string} refreshToken 카카오 리프레시 토큰
   * @returns 토큰 정보
   */
  static async refreshToken(refreshToken) {
    const response = await axios.post(
      this.tokenUrl,
      {
        grant_type: "refresh_token",
        client_id: KAKAO_CLIENT_ID,
        client_secret: KAKAO_CLIENT_SECRET,
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
   * 카카오 유저 정보 조회
   * @param {string} accessToken 카카오 엑세스 토큰
   * @returns 유저 정보
   */
  static async getUserInfo(accessToken) {
    const response = await axios.get(`${this.apiUrl}/v2/user/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    return response.data;
  }

  /**
   * 카카오 로그아웃
   * @param {string} accessToken 카카오 엑세스 토큰
   * @returns 로그아웃한 회원의 id
   */
  static async logout(accessToken) {
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

  /**
   * 카카오 연동 해제
   * @param {string} accessToken 카카오 엑세스 토큰
   * @returns 연동 해제한 회원의 id
   */
  static async unlink(accessToken) {
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
