import asyncHandler from "../utils/ControllerUtils.js";
import { UserModel } from "../utils/Model.js";
import { upload, deleteUploadedFiles } from "../utils/Upload.js";

/**
 * 유저 정보 수정
 */
export const updateUserInfo = asyncHandler(async (req, res) => {
  const { newNickname, useDefaultProfile } = req.body; // 기본 프로필 사용 여부 추가
  const kakaoId = req.userId;

  const userInfo = await UserModel.findOne({ kakaoId });
  if (!userInfo) {
    return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
  } else if (userInfo.kakaoId !== kakaoId) {
    return res.status(403).json({ message: "유저 정보 수정 권한이 없습니다." });
  }

  if (useDefaultProfile) {
    // 기본 프로필 사용 시
    userInfo.profileImage = ""; // 프로필 이미지 필드를 빈 문자열로 설정
  } else if (req.files && req.files.length > 0) {
    // 사용자 지정 프로필 사용 시
    deleteUploadedFiles(req.files.map((file) => file.path));
    userInfo.profileImage = req.files[0].path; // 업로드된 파일 경로 저장
  }

  userInfo.nickname = newNickname;
  await userInfo.save();

  return res.status(200).json({
    message: "유저 정보 수정 성공",
    kakaoId: kakaoId,
    nickname: newNickname,
    profileImage: userInfo.profileImage, // 프로필 이미지 정보 반환
  });
}, "유저 정보 수정");
