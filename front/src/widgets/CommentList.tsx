import { useLocation } from "react-router-dom";
import { fetchComments } from "@/api/interaction";
import { useQuery } from "@tanstack/react-query";
import { CommentInfo } from "@/shared/types/interface";
import CommentBox from "@/features/interaction/CommentBox";

export default function CommentList() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const reviewId = queryParams.get("reviewId");
  const { data, isLoading, error } = useQuery<CommentInfo[]>({
    queryKey: ["comments", reviewId],
    queryFn: () => fetchComments(reviewId as string),
    enabled: !!reviewId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2 className="text-lg font-semibold">댓글({data?.length})</h2>
      <div className="grid mt-4">
        {data?.map((commentInfo, index) => (
          <CommentBox key={index} commentInfo={commentInfo} />
        ))}
      </div>
    </div>
  );
}
