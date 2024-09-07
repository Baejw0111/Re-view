import { genaralApiClient, authApiClient } from "@/api/util";
import { CommentInfo } from "@/shared/types/interface";

/**
 * 리뷰 추천 수 조회 함수
 * @param reviewId 리뷰 ID
 * @returns 리뷰 추천 수
 */
export const fetchReviewLikesCount = async (
  reviewId: string
): Promise<number> => {
  const response = await genaralApiClient.get(`/like/${reviewId}`);
  console.log("리뷰 추천 수 조회 성공:", response.data.likesCount);
  return response.data.likesCount;
};

/**
 * 리뷰 추천 함수
 * @param reviewId 리뷰 ID
 */
export const likeReview = async (reviewId: string): Promise<void> => {
  const response = await authApiClient.post(`/like/${reviewId}`);
  console.log("리뷰 추천 성공:", response.data);
};

/**
 * 리뷰 추천 취소 함수
 * @param reviewId 리뷰 ID
 */
export const cancelLikeReview = async (reviewId: string): Promise<void> => {
  const response = await authApiClient.delete(`/like/${reviewId}`);
  console.log("리뷰 추천 취소 성공:", response.data);
};

/**
 * 댓글 조회 함수
 * @param reviewId 리뷰 ID
 * @returns 댓글 리스트
 */
export const fetchComments = async (
  reviewId: string
): Promise<CommentInfo[]> => {
  const response = await genaralApiClient.get(`/comment/${reviewId}`);
  console.log("댓글 조회 성공:", response.data);
  return response.data;
};

/**
 * 댓글 추가 함수
 * @param reviewId 리뷰 ID
 * @param comment 댓글 내용
 */
export const addComment = async (
  reviewId: string,
  comment: string
): Promise<void> => {
  const response = await authApiClient.post(`/comment/${reviewId}`, {
    comment,
  });
  console.log("댓글 추가 성공:", response.data);
};

/**
 * 댓글 삭제 함수
 * @param commentId 댓글 ID
 */
export const deleteComment = async (commentId: string): Promise<void> => {
  const response = await authApiClient.delete(`/comment/${commentId}`);
  console.log("댓글 삭제 성공:", response.data);
};
