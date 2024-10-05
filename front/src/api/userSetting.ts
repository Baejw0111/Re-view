import { authApiClient } from "./util";

/**
 * 유저 정보 수정
 * @param formData 전송할 유저 정보
 */
export const updateUserInfo = async (formData: FormData): Promise<void> => {
  const response = await authApiClient.put(`/user/info`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log("유저 정보 수정 성공:", response.data);
};
