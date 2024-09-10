import { Avatar, AvatarImage, AvatarFallback } from "@/shared/shadcn-ui/avatar";
import { CommentInfo, UserInfo } from "@/shared/types/interface";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInfoById } from "@/api/interaction";

export default function CommentBox({ comment }: { comment: CommentInfo }) {
  const { data } = useQuery<UserInfo>({
    queryKey: ["user", comment.authorId],
    queryFn: () => fetchUserInfoById(comment.authorId),
  });

  return (
    <div className="flex items-start gap-4 rounded-md hover:bg-muted">
      <Avatar className="h-7 w-7">
        <AvatarImage src={data?.thumbnailImage} alt={data?.nickname} />
        <AvatarFallback>{data?.nickname.slice(0, 1)}</AvatarFallback>
      </Avatar>
      <div className="grid gap-2 flex-1">
        <div className="flex items-center justify-between">
          <div className="font-semibold">{data?.nickname}</div>
          <div className="text-xs text-muted-foreground p-2">
            {new Date(comment.uploadTime).toLocaleDateString()}
          </div>
        </div>
        <p className="text-muted-foreground whitespace-pre-wrap break-all">
          {comment.content}
        </p>
      </div>
    </div>
  );
}
