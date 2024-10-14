import { Button } from "@/shared/shadcn-ui/button";
import { Heart, MessageCircle, X } from "lucide-react";
import UserAvatar from "@/features/user/UserAvatar";
import { NotificationInfo } from "@/shared/types/interface";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInfoById, fetchCommentById } from "@/api/interaction";
import { fetchReviewById } from "@/api/review";
import { API_URL } from "@/shared/constants";

export default function NotificationBox({
  time,
  commentId,
  reviewId,
  category,
}: NotificationInfo) {
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

  return (
    <div className="py-4 border-b last:border-b-0 flex items-start gap-4">
      <UserAvatar
        className="h-9 w-9"
        profileImage={
          category === "like" ? `public/logo.svg` : userInfo?.profileImage
        }
        nickname={category === "like" ? "시스템" : userInfo?.nickname}
      />
      <div className="flex justify-between w-full">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {category === "like" ? (
              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
            ) : (
              <MessageCircle className="w-4 h-4" />
            )}
            <h3 className="font-semibold line-clamp-1">
              {category === "like"
                ? `작성하신 리뷰가 인기 리뷰로 선정되었습니다.`
                : userInfo?.nickname}
            </h3>
            <span className="text-xs text-muted-foreground">
              {time.toLocaleString()}
            </span>
          </div>
          <h4 className="text-xs text-muted-foreground line-clamp-1">
            {reviewInfo?.title}
          </h4>
          <p className="text-md whitespace-pre-wrap break-all">
            {commentInfo?.content}
          </p>
        </div>
        <div className="flex items-start gap-2">
          <img
            className="h-20"
            src={`${API_URL}/${reviewInfo?.images[0]}`}
            alt="review thumbnail"
          />
          <Button
            variant="link"
            size="icon"
            // onClick={() => onDelete(id)}
            aria-label="알림 삭제"
            className="opacity-70 hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
