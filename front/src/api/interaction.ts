import { genaralApiClient, authApiClient } from "@/api/util";
import {
  CommentInfo,
  UserInfo,
  NotificationInfo,
} from "@/shared/types/interface";

/**
 * 유저 조회 함수
 * @param userId 유저 ID
 * @returns 유저 정보
 */
export const fetchUserInfoById = async (userId: number): Promise<UserInfo> => {
  const response = await genaralApiClient.get(`/user/${userId}`);
  console.log("유저 조회 성공:", response.data);
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

/**
 * 리뷰의 댓글 목록 조회 함수
 * @param reviewId 리뷰 ID
 * @returns 댓글 리스트
 */
export const fetchComments = async (
  reviewId: string
): Promise<CommentInfo[]> => {
  const response = await genaralApiClient.get(`/review/${reviewId}/comments`);
  console.log("리뷰 댓글 목록 조회 성공:", response.data);
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

/**
 * 유저가 작성한 댓글 조회 함수
 * @param userId 유저 ID
 * @returns 댓글 리스트
 */
export const fetchUserComments = async (
  userId: number
): Promise<CommentInfo[]> => {
  const response = await genaralApiClient.get(`/user/${userId}/comments`);
  console.log("유저가 작성한 댓글 조회 성공:", response.data);
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
  const response = await genaralApiClient.get(`/comment/${commentId}`);
  console.log("특정 댓글 조회 성공:", response.data);
  return response.data;
};

/**
 * 알림 조회 함수
 * @returns 알림 리스트
 */
export const fetchNotifications = async (): Promise<NotificationInfo[]> => {
  const response = await authApiClient.get("/notifications");
  console.log("알림 조회 성공:", response.data);
  return response.data;
};

/**
 * 알림 확인 시간 업데이트 함수
 */
export const updateNotificationCheckTime = async (): Promise<void> => {
  const checkTime = new Date().toISOString();
  const response = await authApiClient.post("/notifications/check", {
    checkTime,
  });
  console.log("알림 확인 시간 업데이트 성공:", response.data);
};
