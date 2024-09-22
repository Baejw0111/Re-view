import { Avatar, AvatarImage, AvatarFallback } from "@/shared/shadcn-ui/avatar";
import { CommentInfo, UserInfo } from "@/shared/types/interface";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInfoById, deleteComment } from "@/api/interaction";
import { Trash, Pencil, Heart } from "lucide-react";
import { Button } from "@/shared/shadcn-ui/button";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function CommentBox({
  commentInfo,
}: {
  commentInfo: CommentInfo;
}) {
  const { id: reviewId } = useParams();
  const queryClient = useQueryClient();

  // 댓글 작성자 정보 가져오기
  const { data } = useQuery<UserInfo>({
    queryKey: ["userInfo", commentInfo.authorId],
    queryFn: () => fetchUserInfoById(commentInfo.authorId),
  });

  // 댓글 삭제
  const { mutate: deleteCommentMutate } = useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", reviewId] });
    },
  });

  return (
    <div className="flex items-start gap-4">
      <Avatar className="h-7 w-7">
        <AvatarImage src={data?.thumbnailImage} alt={data?.nickname} />
        <AvatarFallback>{data?.nickname.slice(0, 1)}</AvatarFallback>
      </Avatar>
      <div className="grid gap-2 flex-1">
        <div className="flex items-center justify-between">
          <div className="font-semibold">{data?.nickname}</div>
          <div className="text-xs text-muted-foreground p-2">
            {new Date(commentInfo.uploadTime).toLocaleDateString()}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-muted-foreground whitespace-pre-wrap break-all">
            {commentInfo.content}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Heart className="w-4 h-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon">
              <Pencil className="w-4 h-4 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteCommentMutate(commentInfo._id)}
            >
              <Trash className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
