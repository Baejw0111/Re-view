import { generalApiClient, authApiClient } from "@/api/util";
import { ReviewInfo } from "@/shared/types/interface";

/**
 * 최신 리뷰 목록 조회 함수
 * @param lastReviewId 마지막 리뷰 ID
 * @returns 리뷰 목록
 */
export const fetchLatestFeed = async (
  lastReviewId: string
): Promise<string[]> => {
  const response = await generalApiClient.get(`/review/latest`, {
    params: { lastReviewId },
  });

  return response.data;
};

/**
 * 인기 리뷰 목록 조회 함수
 * @param lastReviewId 마지막 리뷰 ID
 * @returns 리뷰 목록
 */
export const fetchPopularFeed = async (
  lastReviewId: string
): Promise<string[]> => {
  const response = await generalApiClient.get(`/review/popular`, {
    params: { lastReviewId },
  });

  return response.data;
};

/**
 * 리뷰 검색 함수
 * @param query 검색어
 * @param lastReviewId 마지막 리뷰 ID
 * @returns 리뷰 목록
 */
export const searchReviews = async (
  query: string,
  lastReviewId: string
): Promise<string[]> => {
  const response = await generalApiClient.get(`/search/reviews`, {
    params: { query, lastReviewId },
  });

  return response.data;
};

/**
 * 리뷰 업로드 함수
 * @param formData 전송할 리뷰 정보
 */
export const uploadReview = async (formData: FormData): Promise<void> => {
  await authApiClient.post(`/review`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * 리뷰 상세 조회 함수
 * @param reviewId 리뷰 ID
 * @returns 리뷰 상세 정보
 */
export const fetchReviewById = async (
  reviewId: string
): Promise<ReviewInfo> => {
  const response = await generalApiClient.get(`/review/${reviewId}`);
  return response.data;
};

/**
 * 리뷰 삭제 함수
 * @param reviewId 리뷰 ID
 */
export const deleteReview = async (reviewId: string): Promise<void> => {
  await authApiClient.delete(`/review/${reviewId}`);
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
  await authApiClient.patch(`/review/${reviewId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
