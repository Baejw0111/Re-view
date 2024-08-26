import { Avatar, AvatarImage, AvatarFallback } from "@/shared/shadcn-ui/avatar";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store/index";
import { UserRound } from "lucide-react";

export default function UserProfile() {
  const userInfo = useSelector((state: RootState) => state.userInfo);
  return (
    <Avatar className="w-9 h-9">
      <AvatarImage src={userInfo.thumbnailImage} />
      <AvatarFallback>
        <UserRound />
      </AvatarFallback>
    </Avatar>
  );
}
