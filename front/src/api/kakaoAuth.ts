import { genaralApiClient, authApiClient } from "@/api/util";
import { UserInfo } from "@/shared/types/interface";

/**
 * 카카오 토큰 요청 함수
 * @param code 카카오 인증 코드
 */
export const getKakaoToken = async (code: string): Promise<void> => {
  try {
    const response = await genaralApiClient.post(
      `/login/kakao`,
      { code },
      {
        withCredentials: true,
      }
    );

    console.log(response.data);
  } catch (error) {
    console.error("카카오 토큰 요청 실패:", error);
    throw error;
  }
};

/**
 * 카카오 서버에서 유저 정보 조회하는 함수
 * @returns 유저 정보
 */
export const getKakaoUserInfo = async (): Promise<UserInfo> => {
  const response = await authApiClient.get(`/auth/kakao/user`);
  console.log(response.data);

  return response.data;
};

// 카카오 서버에서 로그아웃 요청 후 쿠키 삭제
export const logOutKakao = async (): Promise<void> => {
  const response = await authApiClient.post(`/logout/kakao`, {});
  console.log(response.data);
};
