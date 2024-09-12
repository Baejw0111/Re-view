import { genaralApiClient, authApiClient } from "@/api/util";
import { UserInfo } from "@/shared/types/interface";

/**
 * 카카오 토큰 요청 함수
 * @param code 카카오 인증 코드
 */
export const getKakaoToken = async (code: string): Promise<void> => {
  const response = await genaralApiClient.post(
    `/login/kakao`,
    { code },
    {
      withCredentials: true,
    }
  );

  console.log("카카오 토큰 요청 성공:", response.data);
};

/**
 * 카카오 서버에서 유저 정보 조회하는 함수
 * @returns 유저 정보
 */
export const getKakaoUserInfo = async (): Promise<{
  isNewMember: boolean;
  userInfo: UserInfo;
}> => {
  const response = await authApiClient.get(`/auth/kakao/user`);
  console.log("카카오 유저 정보 조회 성공:", response.data);

  return response.data;
};

// 카카오 서버에서 로그아웃 요청 후 쿠키 삭제
export const logOutKakao = async (): Promise<void> => {
  const response = await authApiClient.post(`/logout/kakao`, {});
  console.log("카카오 로그아웃 성공:", response.data);
};

export const updateKakaoUserNickname = async (
  newNickname: string
): Promise<void> => {
  const response = await authApiClient.post(`/auth/kakao/updateUserNickname`, {
    newNickname,
  });
  console.log("카카오 유저 닉네임 수정 성공:", response.data);
};

export const deleteUserAccount = async (): Promise<void> => {
  const response = await authApiClient.delete(
    `/auth/kakao/deleteUserAccount`,
    {}
  );
  console.log("카카오 유저 계정 삭제 성공:", response.data);
};
