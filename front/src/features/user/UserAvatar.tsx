import { Avatar, AvatarImage, AvatarFallback } from "@/shared/shadcn-ui/avatar";
import { UserRound } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { API_URL } from "@/shared/constants";

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
          src={`${API_URL}/${profileImage}`}
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
