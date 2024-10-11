import { Button } from "@/shared/shadcn-ui/button";
import { Heart, MessageCircle, X } from "lucide-react";
import UserAvatar from "@/features/user/UserAvatar";
import { NotificationInfo } from "@/shared/types/interface";

export default function NotificationBox({
  avatarImage,
  title,
  message,
  time,
  reviewTitle,
  reviewThumbnail,
  category,
}: NotificationInfo) {
  return (
    <div className="p-4 border-b last:border-b-0 flex items-start gap-4">
      <UserAvatar
        className="h-9 w-9"
        profileImage={avatarImage}
        nickname={title}
      />
      <div className="flex justify-between items-start w-full">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {category === "like" ? (
              <Heart className="w-4 h-4" />
            ) : (
              <MessageCircle className="w-4 h-4" />
            )}
            <h3 className="font-semibold">{title}</h3>
            <span className="text-xs text-muted-foreground">
              {time.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{reviewTitle}</p>
          <p className="text-md">{message}</p>
        </div>
        <div className="flex items-start gap-2">
          <img className="h-20" src={reviewThumbnail} alt="review thumbnail" />
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
