import { useLocation } from "react-router-dom";
import { fetchReviewCommentList } from "@/api/interaction";
import { useQuery } from "@tanstack/react-query";
import CommentBox from "@/features/interaction/CommentBox";

export default function CommentList() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const reviewId = queryParams.get("reviewId");
  const {
    data: commentIdList,
    isLoading,
    error,
  } = useQuery<string[]>({
    queryKey: ["reviewCommentList", reviewId],
    queryFn: () => fetchReviewCommentList(reviewId as string),
    enabled: !!reviewId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2 className="pt-2 text-lg font-semibold">
        댓글({commentIdList?.length})
      </h2>
      <div className="grid mt-4">
        {commentIdList?.map((commentId, index) => (
          <CommentBox key={index} commentId={commentId} />
        ))}
      </div>
    </div>
  );
}
