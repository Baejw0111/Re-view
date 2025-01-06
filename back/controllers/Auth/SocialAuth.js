/**
 * 소셜 로그인 인증 클래스
 */
class SocialAuth {
  constructor(config) {
    this.clientId = config.clientId; // 클라이언트 ID
    this.clientSecret = config.clientSecret; // 클라이언트 시크릿
    this.redirectUri = config.redirectUri; // 리다이렉트 URI
    this.tokenUrl = config.tokenUrl; // 토큰 발급 URL
    this.apiUrl = config.apiUrl; // API URL
  }

  // 토큰 발급 요청
  async getToken(code) {
    throw new Error("getToken 메서드가 구현되지 않았습니다.");
  }

  // 토큰 검증
  async verifyToken(accessToken) {
    throw new Error("verifyToken 메서드가 구현되지 않았습니다.");
  }

  // 토큰 갱신
  async refreshToken(refreshToken) {
    throw new Error("refreshToken 메서드가 구현되지 않았습니다.");
  }

  // 유저 정보 조회
  async getUserInfo(accessToken) {
    throw new Error("getUserInfo 메서드가 구현되지 않았습니다.");
  }

  // 로그아웃
  async logout(accessToken) {
    throw new Error("logout 메서드가 구현되지 않았습니다.");
  }

  // 계정 연결 해제(회원 탈퇴)
  async unlink(accessToken) {
    throw new Error("unlink 메서드가 구현되지 않았습니다.");
  }
}

export default SocialAuth;
