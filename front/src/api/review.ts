import { genaralApiClient, authApiClient } from "@/api/util";
import { ReviewInfo } from "@/shared/types/interface";

/**
 * 피드에 표시할 리뷰 ID 리스트를 가져오는 함수
 * @returns 리뷰 ID 리스트
 */
export const fetchFeed = async (): Promise<string[]> => {
  const response = await genaralApiClient.get(`/review`);
  console.log("피드 리뷰 ID 리스트 조회 성공:", response.data);

  return response.data;
};

/**
 * 리뷰 업로드 함수
 * @param formData 전송할 리뷰 정보
 */
export const uploadReview = async (formData: FormData): Promise<void> => {
  const response = await authApiClient.post(`/review`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log("리뷰 업로드 성공:", response.data);
};

/**
 * 리뷰 상세 조회 함수
 * @param reviewId 리뷰 ID
 * @returns 리뷰 상세 정보
 */
export const fetchReviewById = async (
  reviewId: string,
  kakaoId: number
): Promise<ReviewInfo> => {
  const response = await genaralApiClient.get(`/review/${reviewId}`, {
    params: { kakaoId },
  });
  console.log("리뷰 상세 조회 성공:", response.data);

  return response.data;
};

/**
 * 리뷰 삭제 함수
 * @param reviewId 리뷰 ID
 */
export const deleteReview = async (reviewId: string): Promise<void> => {
  const response = await authApiClient.delete(`/review/${reviewId}`);
  console.log("리뷰 삭제 성공:", response.data);
};

/**
 * 리뷰 수정 함수
 * @param reviewId 리뷰 ID
 * @param formData 전송할 리뷰 정보
 */
export const editReview = async (
  reviewId: string,
  formData: FormData
): Promise<void> => {
  const response = await authApiClient.patch(`/review/${reviewId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log("리뷰 수정 성공:", response.data);
};
