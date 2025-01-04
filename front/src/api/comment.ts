import { authApiClient, generalApiClient } from "@/api/util.ts";
import { CommentInfo } from "@/shared/types/interface";

/**
 * 댓글 추가 함수
 * @param reviewId 리뷰 ID
 * @param comment 댓글 내용
 */
export const addComment = async (
  reviewId: string,
  comment: string
): Promise<void> => {
  await authApiClient.post(`/comment/${reviewId}`, {
    comment,
  });
};

/**
 * 리뷰의 댓글 개수 조회 함수
 * @param reviewId 리뷰 ID
 * @returns 댓글 개수
 */
export const fetchCommentCount = async (reviewId: string): Promise<number> => {
  const response = await generalApiClient.get(
    `/review/${reviewId}/comments/count`
  );

  return response.data;
};

/**
 * 특정 댓글 조회 함수
 * @param commentId 댓글 ID
 * @returns 댓글 정보
 */
export const fetchCommentById = async (
  commentId: string
): Promise<CommentInfo> => {
  const response = await generalApiClient.get(`/comment/${commentId}`);

  return response.data;
};

/**
 * 리뷰의 댓글 목록 조회 함수
 * @param reviewId 리뷰 ID
 * @returns 댓글 리스트
 */
export const fetchReviewCommentList = async (
  reviewId: string
): Promise<CommentInfo[]> => {
  const response = await generalApiClient.get(`/review/${reviewId}/comments`);

  return response.data;
};

/**
 * 댓글 삭제 함수
 * @param commentId 댓글 ID
 */
export const deleteComment = async (commentId: string): Promise<void> => {
  await authApiClient.delete(`/comment/${commentId}`);
};
