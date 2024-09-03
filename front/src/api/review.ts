import { genaralApiClient, authApiClient } from "@/api/util";
import { ReviewInfo } from "@/shared/types/interface";

/**
 * 리뷰 리스트를 가져오는 함수
 * @returns 리뷰 리스트
 */
export const fetchReviewList = async (): Promise<ReviewInfo[]> => {
  try {
    const response = await genaralApiClient.get(`/review`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("리뷰 리스트 조회 실패:", error);
    throw error;
  }
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

  console.log(response.data);
};

/**
 * 리뷰 상세 조회 함수
 * @param reviewId 리뷰 ID
 * @returns 리뷰 상세 정보
 */
export const fetchReviewById = async (
  reviewId: string
): Promise<ReviewInfo> => {
  try {
    const response = await genaralApiClient.get(`/review/${reviewId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("리뷰 상세 조회 실패:", error);
    throw error;
  }
};

/**
 * 리뷰 삭제 함수
 * @param reviewId 리뷰 ID
 */
export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    const response = await authApiClient.delete(`/review/${reviewId}`);
    console.log(response.data);
  } catch (error) {
    console.error("리뷰 삭제 실패:", error);
    throw error;
  }
};
