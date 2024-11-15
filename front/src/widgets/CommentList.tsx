import { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { fetchReviewCommentList } from "@/api/comment";
import { useQuery } from "@tanstack/react-query";
import CommentBox from "@/features/interaction/CommentBox";
import { CommentInfo } from "@/shared/types/interface";

export default function CommentList() {
  const [queryParams] = useSearchParams();
  const reviewId = queryParams.get("reviewId");
  const { hash } = useLocation();
  const commentId = hash.replace("#", "");

  const {
    data: commentIdList,
    isLoading,
    error,
  } = useQuery<CommentInfo[]>({
    queryKey: ["reviewCommentList", reviewId],
    queryFn: () => fetchReviewCommentList(reviewId as string),
    enabled: !!reviewId,
  });

  useEffect(() => {
    if (commentId && commentIdList) {
      const commentElement = document.getElementById(commentId);

      if (commentElement) {
        commentElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  }, [commentId, commentIdList]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div id="comment-list">
      <h2 className="pt-6 text-lg font-semibold">
        댓글({commentIdList?.length})
      </h2>
      <div className="grid mt-4">
        {commentIdList?.map((commentInfo, index) => (
          <CommentBox
            key={index}
            commentInfo={commentInfo}
            highlight={commentId === commentInfo._id}
          />
        ))}
      </div>
    </div>
  );
}
