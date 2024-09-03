import { apiClient } from "@/api/util";
import { withTokenRefresh } from "@/api/util";
import { CommentInfo } from "@/shared/types/interface";

export const fetchReviewLikesCount = async (
  reviewId: string
): Promise<number> => {
  try {
    const response = await apiClient.get(`/like/${reviewId}`);
    console.log(response.data);
    return response.data.likesCount;
  } catch (error) {
    console.error("리뷰 추천 조회 실패:", error);
    throw error;
  }
};

export const likeReview = withTokenRefresh(
  async (reviewId: string): Promise<void> => {
    try {
      const response = await apiClient.post(`/like/${reviewId}`);
      console.log(response.data);
    } catch (error) {
      console.error("리뷰 추천 실패:", error);
      throw error;
    }
  }
);

export const cancelLikeReview = withTokenRefresh(
  async (reviewId: string): Promise<void> => {
    try {
      const response = await apiClient.delete(`/like/${reviewId}`);
      console.log(response.data);
    } catch (error) {
      console.error("리뷰 추천 취소 실패:", error);
      throw error;
    }
  }
);

export const fetchComments = async (
  reviewId: string
): Promise<CommentInfo[]> => {
  try {
    const response = await apiClient.get(`/comment/${reviewId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("댓글 조회 실패:", error);
    throw error;
  }
};

export const addComment = withTokenRefresh(
  async ({
    reviewId,
    comment,
  }: {
    reviewId: string;
    comment: string;
  }): Promise<void> => {
    try {
      const response = await apiClient.post(
        `/comment/${reviewId}`,
        { comment },
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("댓글 추가 실패:", error);
      throw error;
    }
  }
);

export const deleteComment = withTokenRefresh(
  async (commentId: string): Promise<void> => {
    try {
      const response = await apiClient.delete(`/comment/${commentId}`);
      console.log(response.data);
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      throw error;
    }
  }
);
