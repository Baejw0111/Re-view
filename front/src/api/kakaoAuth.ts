import { apiClient } from "@/api/util";
import { UserInfo } from "@/shared/types/interface";
import { withTokenRefresh } from "@/api/util";

/**
 * 카카오 토큰 요청 함수
 * @param code 카카오 인증 코드
 */
export const getKakaoToken = async (code: string): Promise<void> => {
  try {
    const response = await apiClient.post(
      `/login/kakao`,
      { code: code },
      { withCredentials: true }
    );

    console.log(response.data);
  } catch (error) {
    console.error("카카오 토큰 요청 실패:", error);
    throw error;
  }
};
/**
 * 카카오 액세스 토큰 갱신 함수
 * withCredentials: true 옵션으로 쿠키를 전송해 사용자 인증
 */
export const refreshKakaoAccessToken = async (): Promise<void> => {
  try {
    const response = await apiClient.post(
      `/auth/kakao/refresh`,
      {},
      {
        withCredentials: true,
      }
    );

    console.log(response.data);
  } catch (error) {
    console.error("카카오 액세스 토큰 갱신 실패:", error);
    throw error;
  }
};
/**
 * 카카오 서버에서 유저 정보 조회하는 함수
 * withCredentials: true 옵션으로 쿠키를 전송해 사용자 인증
 * @returns 유저 정보
 */
export const getKakaoUserInfo = withTokenRefresh(
  async (): Promise<UserInfo> => {
    const response = await apiClient.get(`/auth/kakao/user`, {
      withCredentials: true,
    });
    console.log(response.data);

    return response.data;
  }
);

/**
 * 카카오 서버에서 로그아웃 요청 후 쿠키 삭제
 * withCredentials: true 옵션으로 쿠키를 전송해 사용자 인증
 */
export const logOutKakao = withTokenRefresh(async (): Promise<void> => {
  const response = await apiClient.post(
    `/logout/kakao`,
    {},
    {
      withCredentials: true,
    }
  );
  console.log(response.data);
});
