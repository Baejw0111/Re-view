import { useEffect, useState } from "react";
import UserAvatar from "@/features/user/UserAvatar";
import { CommentInfo } from "@/shared/types/interface";
import { deleteComment } from "@/api/comment";
import { Trash, Siren } from "lucide-react";
import { Button } from "@/shared/shadcn-ui/button";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import ProfilePopOver from "@/widgets/ProfilePopOver";
import { claculateTime } from "@/shared/lib/utils";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { sendUserReportComment } from "@/api/user";
import Alert from "@/widgets/Alert";

export default function CommentBox({
  commentInfo,
  highlight,
}: {
  commentInfo: CommentInfo;
  highlight?: boolean;
}) {
  const queryClient = useQueryClient();
  const [isHighlight, setIsHighlight] = useState(highlight);
  const aliasId = useSelector((state: RootState) => state.userInfo.aliasId);

  // 댓글 삭제
  const { mutate: deleteCommentMutate } = useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      toast.success("댓글이 삭제되었습니다.");
      queryClient.invalidateQueries({
        queryKey: ["reviewCommentList", commentInfo.reviewId],
      });
      queryClient.invalidateQueries({
        queryKey: ["commentCount", commentInfo.reviewId],
      });
    },
  });

  const { mutate: reportCommentMutate } = useMutation({
    mutationFn: () =>
      sendUserReportComment(commentInfo.reviewId, commentInfo.aliasId),
    onSuccess: () => {
      toast.success("댓글이 신고되었습니다.");
    },
  });

  const handleReportComment = () => {
    if (aliasId === "") {
      toast.error("로그인 후 이용해주세요.");
      return;
    }
    reportCommentMutate();
  };

  useEffect(() => {
    if (highlight) {
      const timer = setTimeout(() => setIsHighlight(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [highlight]);

  return (
    <>
      {commentInfo && (
        <div
          className={`py-2 flex items-start gap-2.5 transition-colors duration-300 ${
            isHighlight ? "bg-accent" : ""
          }`}
          id={commentInfo.aliasId}
        >
          <ProfilePopOver userId={commentInfo.authorId}>
            <Button variant="ghost" className="h-12 w-12 rounded-full">
              <UserAvatar
                profileImage={commentInfo.profileImage}
                nickname={commentInfo.nickname}
              />
            </Button>
          </ProfilePopOver>
          <div className="flex flex-col gap-0.5 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link
                  to={`/profile/${commentInfo.authorId}`}
                  className={`font-semibold text-sm ${
                    commentInfo.nickname === "운영자" ? "text-orange-500" : ""
                  }`}
                >
                  {commentInfo.nickname}
                </Link>
                <span className="text-xs text-muted-foreground">
                  {claculateTime(commentInfo.uploadTime)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* <Button variant="ghost" size="icon">
                  <Pencil className="w-4 h-4 text-muted-foreground" />
                </Button> */}
                {commentInfo.authorId === aliasId ? (
                  <Alert
                    title="댓글을 삭제하시겠습니까?"
                    description=""
                    onConfirm={() => deleteCommentMutate(commentInfo.aliasId)}
                  >
                    <Button variant="ghost" size="icon">
                      <Trash className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </Alert>
                ) : (
                  <Alert
                    title="댓글을 신고하시겠습니까?"
                    description=""
                    onConfirm={handleReportComment}
                  >
                    <Button variant="ghost" size="icon">
                      <Siren className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </Alert>
                )}
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
