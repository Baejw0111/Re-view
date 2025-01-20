import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchReviewCommentList } from "@/api/comment";
import { useSuspenseQuery } from "@tanstack/react-query";
import CommentBox from "@/features/interaction/CommentBox";
import { CommentInfo } from "@/shared/types/interface";

export default function CommentList({ reviewId }: { reviewId: string }) {
  const { hash } = useLocation();
  const commentId = hash.replace("#", "");

  const { data: commentIdList } = useSuspenseQuery<CommentInfo[]>({
    queryKey: ["reviewCommentList", reviewId],
    queryFn: () => (reviewId ? fetchReviewCommentList(reviewId) : []),
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

  return (
    <div id="comment-list">
      <h2 className="pt-6 text-lg font-semibold">
        댓글({commentIdList?.length})
      </h2>
      <div className="grid my-4">
        {commentIdList.map((commentInfo, index) => (
          <CommentBox
            key={index}
            commentInfo={commentInfo}
            highlight={commentId === commentInfo.aliasId}
          />
        ))}
      </div>
    </div>
  );
}
