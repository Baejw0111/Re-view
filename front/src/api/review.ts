import { apiClient } from "@/api/util";
import { ReviewInfo } from "@/shared/types/interface";
import { withTokenRefresh } from "@/api/util";

/**
 * 리뷰 리스트를 가져오는 함수
 * @returns 리뷰 리스트
 */
export const fetchReviewList = async (): Promise<ReviewInfo[]> => {
  try {
    const response = await apiClient.get(`/review`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("리뷰 리스트 조회 실패:", error);
    throw error;
  }
};

/**
 * 리뷰 업로드 함수
 * withCredentials: true 옵션으로 쿠키를 전송해 사용자 인증
 * @param formData 전송할 리뷰 정보
 */
export const uploadReview = withTokenRefresh(
  async (formData: FormData): Promise<void> => {
    const response = await apiClient.post(`/review`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response.data);
  }
);

/**
 * 리뷰 상세 조회 함수
 * @param reviewId 리뷰 ID
 * @returns 리뷰 상세 정보
 */
export const fetchReviewById = async (
  reviewId: string
): Promise<ReviewInfo> => {
  try {
    const response = await apiClient.get(`/review/${reviewId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("리뷰 상세 조회 실패:", error);
    throw error;
  }
};
