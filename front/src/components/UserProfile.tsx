import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { UserRound } from "lucide-react";

export default function UserProfile() {
  const userInfo = useSelector((state: RootState) => state.userInfo);
  return (
    <Avatar className="w-9 h-9">
      <AvatarImage src={userInfo.profileImage} />
      <AvatarFallback>
        <UserRound />
      </AvatarFallback>
    </Avatar>
  );
}
