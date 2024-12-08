import { generalApiClient, authApiClient } from "@/api/util";
import { UserInfo } from "@/shared/types/interface";

/**
 * 카카오 토큰 요청 함수
 * @param code 카카오 인증 코드
 */
export const getKakaoToken = async (code: string): Promise<void> => {
  await generalApiClient.post(
    `/auth/kakao/login`,
    { code },
    {
      withCredentials: true,
    }
  );
};

/**
 * 로그인한 유저의 정보를 조회하는 함수
 * @returns 유저 정보
 */
export const getLoginUserInfo = async (): Promise<UserInfo> => {
  const response = await authApiClient.get(`/auth/kakao/user`);

  return response.data;
};

// 카카오 서버에서 로그아웃 요청 후 쿠키 삭제
export const logOutKakao = async (): Promise<void> => {
  await authApiClient.post(`/auth/kakao/logout`, {});
};

// 카카오 서버에서 유저 계정 삭제 요청
export const deleteUserAccount = async (): Promise<void> => {
  await authApiClient.delete(`/auth/kakao/delete`, {});
};
