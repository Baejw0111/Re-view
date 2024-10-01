import { authApiClient } from "./util";

export const updateUserNickname = async (
  newNickname: string
): Promise<void> => {
  const response = await authApiClient.post(`/user/nickname`, {
    newNickname,
  });
  console.log("유저 닉네임 수정 성공:", response.data);
};
