import { Avatar, AvatarImage, AvatarFallback } from "@/shared/shadcn-ui/avatar";
import { UserRound } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export default function UserProfile({
  className,
  thumbnailImage,
  nickname,
}: {
  className?: string;
  thumbnailImage?: string;
  nickname?: string;
}) {
  return (
    <Avatar className={cn("w-9 h-9", className)}>
      <AvatarImage src={thumbnailImage} alt={nickname} />
      <AvatarFallback>
        <UserRound className="w-[70%] h-[70%]" />
      </AvatarFallback>
    </Avatar>
  );
}
