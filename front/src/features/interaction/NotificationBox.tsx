import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "@/shared/shadcn-ui/button";
import { Heart, MessageCircle, X } from "lucide-react";
import UserAvatar from "@/features/user/UserAvatar";
import { NotificationInfo } from "@/shared/types/interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNotification } from "@/api/notification";
import { IMG_SRC } from "@/shared/constants";
import { AspectRatio } from "@/shared/shadcn-ui/aspect-ratio";
import { cn } from "@/shared/lib/utils";
import { claculateTime } from "@/shared/lib/utils";
import { toast } from "sonner";

export default function NotificationBox({
  className,
  notificationInfo,
}: {
  className?: string;
  notificationInfo: NotificationInfo;
}) {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const {
    _id,
    time,
    commentId,
    reviewId,
    category,
    profileImage,
    nickname,
    title,
    reviewTitle,
    content,
    reviewThumbnail,
  } = notificationInfo;

  const { mutate: deleteNotificationMutate } = useMutation({
    mutationFn: () => deleteNotification(_id),
    onSuccess: () => {
      toast.success("알림이 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      toast.error("알림 삭제 실패");
    },
  });

  const handleDeleteNotification = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteNotificationMutate();
  };

  return (
    <div
      className={cn(
        "py-3 border-b last:border-b-0 first:pt-4 flex justify-between gap-1 md:gap-2 w-full",
        className
      )}
    >
      <Link
        to={
          pathname === "/edit" || pathname === "/write"
            ? `/?reviewId=${reviewId}`
            : `?${new URLSearchParams({
                ...Object.fromEntries(searchParams),
                reviewId: reviewId,
              })}` + `${category === "comment" ? `#${commentId}` : ""}`
        }
        className="flex items-start gap-4 w-full"
      >
        <UserAvatar profileImage={profileImage} nickname={nickname} />
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
                {title}
              </h3>
            </div>
            <h4 className="text-sm text-muted-foreground line-clamp-1">
              {reviewTitle}
            </h4>
            <p className="text-sm whitespace-pre-wrap break-all line-clamp-3">
              {content}
            </p>
            <span className="text-sm text-muted-foreground">
              {claculateTime(time)}
            </span>
          </div>
          <div className="w-24 md:w-28">
            <AspectRatio ratio={16 / 9}>
              <img
                className="w-full h-full object-cover rounded-md"
                src={`${IMG_SRC}/${reviewThumbnail}`}
                alt="review thumbnail"
              />
            </AspectRatio>
          </div>
        </div>
      </Link>
      <Button
        variant="link"
        onClick={handleDeleteNotification}
        aria-label="알림 삭제"
        className="p-0 w-4 h-4 opacity-70 hover:opacity-100 active:opacity-100"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
