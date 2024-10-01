import asyncHandler from "../utils/ControllerUtils.js";
import { UserModel } from "../utils/Model.js";

// 유저 닉네임 수정
export const updateUserNickname = asyncHandler(async (req, res) => {
  const { newNickname } = req.body;
  const kakaoId = req.userId;

  await UserModel.findOneAndUpdate(
    { kakaoId: kakaoId },
    { nickname: newNickname }
  );

  return res.status(200).json({
    message: "유저 닉네임 수정 성공",
    kakaoId: kakaoId,
    nickname: newNickname,
  });
}, "유저 닉네임 수정");
