import UserAvatar from "@/features/user/UserAvatar";
import { CommentInfo, UserInfo } from "@/shared/types/interface";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInfoById, deleteComment } from "@/api/interaction";
import { Trash, Pencil } from "lucide-react";
import { Button } from "@/shared/shadcn-ui/button";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import ProfilePopOver from "@/widgets/ProfilePopOver";
import { claculateTime } from "@/shared/lib/utils";

export default function CommentBox({
  commentInfo,
}: {
  commentInfo: CommentInfo;
}) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const reviewId = queryParams.get("reviewId");
  const queryClient = useQueryClient();

  // 댓글 작성자 정보 가져오기
  const { data: userInfo } = useQuery<UserInfo>({
    queryKey: ["userInfo", commentInfo.authorId],
    queryFn: () => fetchUserInfoById(commentInfo.authorId),
  });

  // 댓글 삭제
  const { mutate: deleteCommentMutate } = useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      if (reviewId) {
        queryClient.invalidateQueries({ queryKey: ["comments", reviewId] });
      }
      queryClient.invalidateQueries({
        queryKey: ["userComments", commentInfo.authorId],
      });
    },
  });

  return (
    <>
      {userInfo && (
        <div className="py-2 flex items-start gap-2.5">
          <ProfilePopOver userId={userInfo.kakaoId}>
            <Button variant="ghost" className="h-12 w-12 rounded-full">
              <UserAvatar
                profileImage={userInfo.profileImage}
                nickname={userInfo.nickname}
              />
            </Button>
          </ProfilePopOver>
          <div className="flex flex-col gap-0.5 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <a
                  href={`/profile/${userInfo.kakaoId}`}
                  className="font-semibold text-sm"
                >
                  {userInfo.nickname}
                </a>
                <span className="text-xs text-muted-foreground">
                  {claculateTime(commentInfo.uploadTime)}
                </span>
              </div>
              <div className="flex items-center gap-2">
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
            <p className="text-sm whitespace-pre-wrap break-all">
              {commentInfo.content}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
