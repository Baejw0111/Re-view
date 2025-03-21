import { generalApiClient, authApiClient } from "@/api/util";
import { UserInfo, CommentInfo, ReviewInfo } from "@/shared/types/interface";

/**
 * 유저 조회 함수
 * @param aliasId 유저 별칭 아이디
 * @returns 유저 정보
 */
export const fetchUserInfoById = async (aliasId: string): Promise<UserInfo> => {
  const response = await generalApiClient.get(`/user/${aliasId}`);
  return response.data;
};

/**
 * 유저 검색 함수
 * @param query 검색어
 * @param lastUserAliasId 이전 검색 결과의 마지막 유저 별칭 아이디
 * @returns 유저 목록
 */
export const searchUsers = async (
  query: string,
  lastUserAliasId: string
): Promise<UserInfo[]> => {
  const response = await generalApiClient.get(`/search/users`, {
    params: { query, lastUserAliasId },
  });

  return response.data;
};

/**
 * 유저가 작성한 댓글 목록 조회 함수
 * @param userAliasId 유저 별칭 아이디
 * @returns 댓글 목록
 */
export const fetchUserCommentList = async (
  userAliasId: string
): Promise<CommentInfo[]> => {
  const response = await generalApiClient.get(`/user/${userAliasId}/comments`);
  return response.data;
};

/**
 * 유저가 작성한 리뷰 목록 조회 함수
 * @param userAliasId 유저 별칭 아이디
 * @returns 리뷰 목록
 */
export const fetchUserReviewList = async (
  userAliasId: string,
  lastReviewId: string
): Promise<ReviewInfo[]> => {
  const response = await generalApiClient.get(`/user/${userAliasId}/reviews`, {
    params: { lastReviewId },
  });

  return response.data;
};

/**
 * 유저가 추천한 리뷰 목록 조회 함수
 * @param userAliasId 유저 별칭 아이디
 * @param lastReviewId 마지막 리뷰 ID
 * @returns 리뷰 목록
 */
export const fetchUserLikedList = async (
  userAliasId: string,
  lastReviewId: string
): Promise<ReviewInfo[]> => {
  const response = await generalApiClient.get(`/user/${userAliasId}/liked`, {
    params: { lastReviewId },
  });

  return response.data;
};

/**
 * 유저 정보 수정
 * @param formData 전송할 유저 정보
 */
export const updateUserInfo = async (formData: FormData): Promise<void> => {
  await authApiClient.put(`/user/info`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * 유저 피드백 전송 함수
 * @param feedback 피드백 내용
 */
export const sendUserFeedback = async (feedback: string): Promise<void> => {
  await authApiClient.post(`/user/feedback`, { feedback });
};

/**
 * 유저 신고 함수
 * @param report 신고 내용
 */
export const sendUserReportReview = async (
  reportedReviewId: string
): Promise<void> => {
  await authApiClient.post(`/user/report/review`, { reportedReviewId });
};

/**
 * 댓글 신고 함수
 * @param reportedReviewId 신고될 리뷰 ID
 * @param reportedCommentId 신고될 댓글 ID
 */
export const sendUserReportComment = async (
  reportedReviewId: string,
  reportedCommentId: string
): Promise<void> => {
  await authApiClient.post(`/user/report/comment`, {
    reportedReviewId,
    reportedCommentId,
  });
};
