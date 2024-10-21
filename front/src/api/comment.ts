import { authApiClient, genaralApiClient } from "@/api/util.ts";
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
  const response = await authApiClient.post(`/comment/${reviewId}`, {
    comment,
  });
  console.log("댓글 추가 성공:", response.data);
};

/**
 * 특정 댓글 조회 함수
 * @param commentId 댓글 ID
 * @returns 댓글 정보
 */
export const fetchCommentById = async (
  commentId: string
): Promise<CommentInfo> => {
  const response = await genaralApiClient.get(`/comment/${commentId}`);
  console.log("특정 댓글 조회 성공:", response.data);
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
  const response = await genaralApiClient.get(`/review/${reviewId}/comments`);
  console.log("리뷰 댓글 목록 조회 성공:", response.data);
  return response.data;
};

/**
 * 댓글 삭제 함수
 * @param commentId 댓글 ID
 */
export const deleteComment = async (commentId: string): Promise<void> => {
  const response = await authApiClient.delete(`/comment/${commentId}`);
  console.log("댓글 삭제 성공:", response.data);
};
