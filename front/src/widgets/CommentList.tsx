import { useParams } from "react-router-dom";
import { fetchComments } from "@/api/interaction";
import { useQuery } from "@tanstack/react-query";
import { CommentInfo } from "@/shared/types/interface";
import CommentBox from "@/features/interaction/CommentBox";

export default function CommentList() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery<CommentInfo[]>({
    queryKey: ["comments", id],
    queryFn: () => fetchComments(id as string),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2 className="text-lg font-semibold">댓글({data?.length})</h2>
      <div className="grid gap-4 mt-4">
        {data?.map((commentInfo, index) => (
          <CommentBox key={index} commentInfo={commentInfo} />
        ))}
      </div>
    </div>
  );
}
