import { Button } from "@/shared/shadcn-ui/button";
import { Link } from "react-router-dom";
import TooltipWrapper from "@/shared/original-ui/TooltipWrapper";
import UserAvatar from "@/features/user/UserAvatar";
import { LoginUserInfo } from "@/shared/types/interface";

export default function ProfileButton({
  userInfo,
}: {
  userInfo: LoginUserInfo;
}) {
  return (
    <TooltipWrapper tooltipText="프로필">
      <Button variant="ghost" className="h-9 w-9 rounded-full shrink-0" asChild>
        <Link to={`/profile/${userInfo.kakaoId}`}>
          <UserAvatar
            className="h-7 w-7"
            profileImage={userInfo.profileImage}
            nickname={userInfo.nickname}
          />
        </Link>
      </Button>
    </TooltipWrapper>
  );
}
