import { authApiClient, generalApiClient } from "@/api/util";

export const fetchLikeStatus = async (
  reviewId: string,
  kakaoId: number
): Promise<{ isLiked: boolean; likesCount: number }> => {
  const response = await generalApiClient.get(`/like/${reviewId}`, {
    params: { kakaoId },
  });

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
