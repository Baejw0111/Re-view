import { Button } from "@/shared/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/shadcn-ui/dropdown-menu";
import { logOutKakao } from "@/api/kakaoAuth";
import { deleteUserAccount } from "@/api/kakaoAuth";
import {
  KAKAO_REST_API_KEY,
  KAKAO_LOGOUT_REDIRECT_URI,
} from "@/shared/constants";
import { Settings, LogOutIcon, UserRoundX } from "lucide-react";

export default function UserSetting() {
  /**
   * 로그아웃 함수
   */
  const handleLogOut = async () => {
    await logOutKakao();
    window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${KAKAO_REST_API_KEY}&logout_redirect_uri=${KAKAO_LOGOUT_REDIRECT_URI}`;
  };

  /**
   * 회원 탈퇴 함수
   */
  const handleDelete = async () => {
    await deleteUserAccount();
    window.location.href = "/";
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={handleLogOut}
          className="flex items-center justify-start gap-2"
        >
          <LogOutIcon />
          <span>로그아웃</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDelete}
          className="flex items-center justify-start gap-2 text-destructive focus:text-destructive focus:bg-destructive/20"
        >
          <UserRoundX />
          <span>회원 탈퇴</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
