import { useParams } from "react-router-dom";
import { fetchComments } from "@/api/interaction";
import { useQuery } from "@tanstack/react-query";
import { CommentInfo } from "@/shared/types/interface";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/shadcn-ui/avatar";

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
      <h2 className="text-lg font-semibold">댓글</h2>
      <div className="grid gap-4 mt-4">
        {data?.map((comment, index) => (
          <div
            className="flex items-start gap-4 rounded-md hover:bg-muted"
            key={index}
          >
            <Avatar className="h-7 w-7">
              <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="grid gap-2 flex-1">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Test</div>
                <div className="text-xs text-muted-foreground p-2">
                  2 days ago
                </div>
              </div>
              <p className="text-muted-foreground whitespace-pre-wrap break-all">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
