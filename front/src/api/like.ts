import { authApiClient, genaralApiClient } from "@/api/util";

export const fetchLikeStatus = async (
  reviewId: string,
  kakaoId: number
): Promise<{ isLiked: boolean; likesCount: number }> => {
  const response = await genaralApiClient.get(`/like/${reviewId}`, {
    params: { kakaoId },
  });

  return response.data;
};

/**
 * 리뷰 추천 함수
 * @param reviewId 리뷰 ID
 */
export const likeReview = async (reviewId: string): Promise<void> => {
  const response = await authApiClient.patch(`/like/${reviewId}`);
  console.log("리뷰 추천 성공:", response.data);
};

/**
 * 리뷰 추천 취소 함수
 * @param reviewId 리뷰 ID
 */
export const unlikeReview = async (reviewId: string): Promise<void> => {
  const response = await authApiClient.patch(`/unlike/${reviewId}`);
  console.log("리뷰 추천 취소 성공:", response.data);
};
