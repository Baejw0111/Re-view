import { Avatar, AvatarImage, AvatarFallback } from "@/shared/shadcn-ui/avatar";
import { UserRound } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { IMG_SRC } from "@/shared/constants";

export default function UserAvatar({
  className,
  profileImage,
  nickname,
}: {
  className?: string;
  profileImage?: string;
  nickname?: string;
}) {
  return (
    <Avatar className={cn("w-9 h-9", className)}>
      {profileImage && (
        <AvatarImage
          src={`${IMG_SRC}/${profileImage}`}
          alt={nickname}
          className="object-cover"
        />
      )}
      <AvatarFallback>
        <UserRound className="w-[70%] h-[70%]" />
      </AvatarFallback>
    </Avatar>
  );
}
