import { generalApiClient, authApiClient } from "@/api/util";
import { UserInfo, CommentInfo } from "@/shared/types/interface";

/**
 * 유저 조회 함수
 * @param userId 유저 ID
 * @returns 유저 정보
 */
export const fetchUserInfoById = async (userId: number): Promise<UserInfo> => {
  const response = await generalApiClient.get(`/user/${userId}`);
  console.log(response.data);
  return response.data;
};

/**
 * 유저 검색 함수
 * @param query 검색어
 * @param lastUserId 마지막 유저 ID
 * @returns 유저 목록
 */
export const searchUsers = async (
  query: string,
  lastUserKakaoId: number
): Promise<number[]> => {
  const response = await generalApiClient.get(`/search/users`, {
    params: { query, lastUserKakaoId },
  });

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
  const response = await generalApiClient.get(`/user/${userId}/comments`);
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
): Promise<string[]> => {
  const response = await generalApiClient.get(`/user/${userId}/reviews`, {
    params: { lastReviewId },
  });

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
): Promise<string[]> => {
  const response = await generalApiClient.get(`/user/${userId}/liked`, {
    params: { lastReviewId },
  });

  return response.data;
};

/**
 * 유저 정보 수정
 * @param formData 전송할 유저 정보
 */
export const updateUserInfo = async (formData: FormData): Promise<void> => {
  await authApiClient.put(`/user/info`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
