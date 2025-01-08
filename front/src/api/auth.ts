import { generalApiClient, authApiClient } from "@/api/util";
import { LoginUserInfo } from "@/shared/types/interface";
import {
  KAKAO_AUTH_URL,
  GOOGLE_AUTH_URL,
  NAVER_AUTH_URL,
} from "@/shared/constants";

/**
 * 소셜 로그인 페이지 이동 함수
 */
export const socialLogin = async (provider: string): Promise<void> => {
  const urlVariants: Record<string, string> = {
    google: GOOGLE_AUTH_URL,
    kakao: KAKAO_AUTH_URL,
    naver: NAVER_AUTH_URL,
  };

  window.location.href = urlVariants[provider];
};

/**
 * 소셜 토큰 요청 함수
 * @param provider 소셜 플랫폼
 * @param code 소셜 인증 코드
 */
export const getToken = async (
  provider: string,
  code: string
): Promise<void> => {
  await generalApiClient.post(
    `/auth/${provider}/token`,
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
export const getLoginUserInfo = async (): Promise<LoginUserInfo> => {
  const response = await authApiClient.get(`/auth/user`);

  return response.data;
};

// 로그아웃 및 쿠키 삭제
export const logOut = async (): Promise<void> => {
  await authApiClient.post(`/auth/logout`, {});
};

// 카카오 서버에서 유저 계정 삭제 요청
export const deleteUserAccount = async (): Promise<void> => {
  await authApiClient.delete(`/auth/delete`, {});
};
