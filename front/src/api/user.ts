import { genaralApiClient, authApiClient } from "@/api/util";
import { UserInfo, CommentInfo, ReviewInfo } from "@/shared/types/interface";

/**
 * 유저 조회 함수
 * @param userId 유저 ID
 * @returns 유저 정보
 */
export const fetchUserInfoById = async (userId: number): Promise<UserInfo> => {
  const response = await genaralApiClient.get(`/user/${userId}`);
  console.log("유저 조회 성공:", response.data);
  return response.data;
};

/**
 * 유저가 작성한 댓글 목록 조회 함수
 * @param userId 유저 ID
 * @returns 댓글 목록
 */
export const fetchUserCommentList = async (
  userId: number
): Promise<CommentInfo[]> => {
  const response = await genaralApiClient.get(`/user/${userId}/comments`);
  console.log("유저가 작성한 댓글 목록 조회 성공:", response.data);
  return response.data;
};

/**
 * 유저가 작성한 리뷰 목록 조회 함수
 * @param userId 유저 ID
 * @returns 리뷰 목록
 */
export const fetchUserReviewList = async (
  userId: number,
  lastReviewId: string
): Promise<ReviewInfo[]> => {
  const response = await genaralApiClient.get(`/user/${userId}/reviews`, {
    params: { lastReviewId },
  });
  console.log("유저가 작성한 리뷰 목록 조회 성공:", response.data);

  return response.data;
};

/**
 * 유저가 추천한 리뷰 목록 조회 함수
 * @param userId 유저 ID
 * @param lastReviewId 마지막 리뷰 ID
 * @returns 리뷰 목록
 */
export const fetchUserLikedList = async (
  userId: number,
  lastReviewId: string
): Promise<ReviewInfo[]> => {
  const response = await genaralApiClient.get(`/user/${userId}/liked`, {
    params: { lastReviewId },
  });
  console.log("유저가 추천한 리뷰 목록 조회 성공:", response.data);

  return response.data;
};

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
