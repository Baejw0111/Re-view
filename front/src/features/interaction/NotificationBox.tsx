import { Button } from "@/shared/shadcn-ui/button";
import { Heart, MessageCircle, X } from "lucide-react";
import UserAvatar from "@/features/user/UserAvatar";
import { NotificationInfo } from "@/shared/types/interface";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserInfoById,
  fetchCommentById,
  deleteNotification,
} from "@/api/interaction";
import { fetchReviewById } from "@/api/review";
import { API_URL } from "@/shared/constants";
import { AspectRatio } from "@/shared/shadcn-ui/aspect-ratio";
import { cn } from "@/shared/lib/utils";
import { claculateTime } from "@/shared/lib/utils";
import { Link } from "react-router-dom";

export default function NotificationBox({
  className,
  notificationInfo,
}: {
  className?: string;
  notificationInfo: NotificationInfo;
}) {
  const queryClient = useQueryClient();
  const { time, commentId, reviewId, category } = notificationInfo;

  const { data: reviewInfo } = useQuery({
    queryKey: ["reviewInfo", reviewId],
    queryFn: () => fetchReviewById(reviewId, 0),
  });

  const { data: commentInfo } = useQuery({
    queryKey: ["commentInfo", commentId],
    queryFn: () => fetchCommentById(commentId),
    enabled: category === "comment",
  });

  const { data: userInfo } = useQuery({
    queryKey: ["userInfo", commentInfo?.authorId],
    queryFn: () => fetchUserInfoById(commentInfo?.authorId ?? 0),
    enabled: category === "comment" && !!commentInfo,
  });

  const { mutate: deleteNotificationMutate } = useMutation({
    mutationFn: () => deleteNotification(notificationInfo._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      alert("알림 삭제 실패");
    },
  });

  return (
    <Link
      to={`/feed?reviewId=${reviewId}${
        category === "comment" ? `&commentId=${commentId}` : ""
      }`}
      className={cn(
        "py-3 border-b last:border-b-0 flex items-start gap-4 w-full",
        className
      )}
    >
      <UserAvatar
        profileImage={
          category === "like" ? `public/logo.svg` : userInfo?.profileImage
        }
        nickname={category === "like" ? "시스템" : userInfo?.nickname}
      />
      <div className="flex justify-between w-full gap-2">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-start gap-1">
            <div className="pt-0.5">
              {category === "like" ? (
                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              ) : (
                <MessageCircle className="w-4 h-4" />
              )}
            </div>
            <h3 className="text-sm font-semibold break-words whitespace-pre-wrap">
              {category === "like"
                ? `작성하신 리뷰가 인기 리뷰로 선정되었습니다.`
                : userInfo?.nickname}
            </h3>
          </div>
          <h4 className="text-sm text-muted-foreground line-clamp-1">
            {reviewInfo?.title}
          </h4>
          <p className="text-sm whitespace-pre-wrap break-all line-clamp-3">
            {commentInfo?.content}
          </p>
          <span className="text-sm text-muted-foreground">
            {claculateTime(time)}
          </span>
        </div>
        <div className="flex items-start gap-1 md:gap-2">
          {category === "comment" && (
            <div className="w-24 md:w-28">
              <AspectRatio ratio={16 / 9}>
                <img
                  className="w-full h-full object-cover rounded-md"
                  src={`${API_URL}/${reviewInfo?.images[0]}`}
                  alt="review thumbnail"
                />
              </AspectRatio>
            </div>
          )}
          <Button
            variant="link"
            onClick={() => deleteNotificationMutate()}
            aria-label="알림 삭제"
            className="p-0 w-4 h-4 opacity-70 hover:opacity-100 active:opacity-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
