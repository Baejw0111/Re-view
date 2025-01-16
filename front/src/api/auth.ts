import { generalApiClient, authApiClient } from "@/api/util";
import { LoginUserInfo } from "@/shared/types/interface";
import {
  TERM_VERSION,
  PRIVACY_VERSION,
  authUrlVariants,
} from "@/shared/constants";

/**
 * 소셜 로그인 페이지 이동 함수
 */
export const socialLogin = async (provider: string): Promise<void> => {
  window.location.href = `${authUrlVariants[provider]}&redirect_uri=${window.location.origin}/oauth/${provider}`;
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
 * 소셜 로그인 연동 정보 조회 함수
 * @param provider 소셜 플랫폼
 */
export const getSocialProvidersInfo = async (): Promise<void> => {
  const response = await authApiClient.get(`/auth/providers/info`);
  return response.data;
};

/**
 * 소셜 로그인 추가 연동 함수
 * @param provider 소셜 플랫폼
 */
export const addSocialProvider = async (
  provider: string,
  code: string
): Promise<void> => {
  await authApiClient.post(
    `/auth/${provider}/add`,
    { code },
    {
      withCredentials: true,
    }
  );
};

/**
 * 소셜 로그인 연동 해제 함수
 * @param provider 소셜 플랫폼
 */
export const deleteSocialProvider = async (provider: string): Promise<void> => {
  await authApiClient.delete(`/auth/${provider}/delete`);
};

/**
 * 회원 가입 함수
 * @param formData 회원 가입 폼 데이터
 */
export const signUp = async (formData: FormData): Promise<void> => {
  await authApiClient.put(`/auth/signup`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    params: {
      termVersion: TERM_VERSION,
      privacyVersion: PRIVACY_VERSION,
    },
  });
};

/**
 * 회원 가입 취소 함수
 */
export const cancelSignUp = async (): Promise<void> => {
  await authApiClient.post(`/auth/signup/cancel`, {});
};

/**
 * 약관 동의 업데이트 함수
 * @param termVersion 약관 버전
 * @param privacyVersion 개인정보 처리 방침 버전
 */
export const updateTermsAgreement = async (): Promise<void> => {
  await authApiClient.post(`/auth/terms/agreement`, {
    termVersion: TERM_VERSION,
    privacyVersion: PRIVACY_VERSION,
  });
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

// 서비스 탈퇴
export const deleteUserAccount = async (): Promise<void> => {
  await authApiClient.delete(`/auth/delete`, {});
};
