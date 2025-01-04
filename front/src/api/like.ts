import { authApiClient, generalApiClient } from "@/api/util";

/**
 * 리뷰 추천 수 조회 함수
 * @param reviewId 리뷰 ID
 * @returns 추천 수
 */
export const fetchLikeCount = async (reviewId: string): Promise<number> => {
  const response = await generalApiClient.get(`/like/${reviewId}/count`);

  return response.data;
};

/**
 * 리뷰 추천 상태 조회 함수
 * @param reviewId 리뷰 ID
 * @returns 추천 상태
 */
export const fetchUserLiked = async (reviewId: string): Promise<boolean> => {
  const response = await authApiClient.get(`/like/${reviewId}`);

  return response.data;
};

/**
 * 리뷰 추천 함수
 * @param reviewId 리뷰 ID
 */
export const likeReview = async (reviewId: string): Promise<void> => {
  await authApiClient.patch(`/like/${reviewId}`);
};

/**
 * 리뷰 추천 취소 함수
 * @param reviewId 리뷰 ID
 */
export const unlikeReview = async (reviewId: string): Promise<void> => {
  await authApiClient.patch(`/unlike/${reviewId}`);
};
