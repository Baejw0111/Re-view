import { useMutation } from "@tanstack/react-query";
import { Button } from "@/shared/shadcn-ui/button";
import TooltipWrapper from "@/shared/original-ui/TooltipWrapper";
import UserAvatar from "@/features/user/UserAvatar";
import { LoginUserInfo } from "@/shared/types/interface";
import { Link } from "react-router";
import { useTheme } from "@/state/theme/useTheme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/shadcn-ui/dropdown-menu";
import { Moon, Sun, UserRound, LogOut, LogIn, Settings } from "lucide-react";
import { logOut } from "@/api/auth";
import Alert from "@/widgets/Alert";

export default function ProfileButton({
  userInfo,
}: {
  userInfo: LoginUserInfo;
}) {
  const { theme, setTheme } = useTheme();
  const { mutate: logOutMutation } = useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      window.location.href = `/`;
    },
  });

  /**
   * 테마 토글 함수
   */
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <>
      <DropdownMenu modal={false}>
        {/* 설정 버튼 */}
        <TooltipWrapper tooltipText="프로필">
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 w-9 rounded-full shrink-0">
              <UserAvatar
                className="h-7 w-7"
                profileImage={userInfo.profileImage}
                nickname={userInfo.nickname}
              />
            </Button>
          </DropdownMenuTrigger>
        </TooltipWrapper>

        <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
          {/* 테마 전환 버튼 */}
          <DropdownMenuItem
            onClick={toggleTheme}
            className="flex items-center justify-start gap-2"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : null}
            {theme === "dark" ? <Sun className="h-5 w-5" /> : null}
            <span className="text-xs">테마 전환</span>
          </DropdownMenuItem>

          {userInfo.aliasId === "" ? (
            <>
              {/* 로그인 버튼 */}
              <DropdownMenuItem
                className="flex items-center justify-start gap-2"
                asChild
              >
                <Link to="/login">
                  <LogIn className="h-5 w-5" />
                  <span className="text-xs">로그인</span>
                </Link>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              {/* 내 프로필 조회 */}
              <DropdownMenuItem
                className="flex items-center justify-start gap-2"
                asChild
              >
                <Link to={`/profile/${userInfo.aliasId}`}>
                  <UserRound className="h-5 w-5" />
                  <span className="text-xs">내 프로필</span>
                </Link>
              </DropdownMenuItem>

              {/* 설정 버튼 */}
              <DropdownMenuItem
                className="flex items-center justify-start gap-2"
                asChild
              >
                <Link to="/settings">
                  <Settings className="h-5 w-5" />
                  <span className="text-xs">설정</span>
                </Link>
              </DropdownMenuItem>

              {/* 로그아웃 버튼 */}
              <Alert
                title="로그아웃하시겠습니까?"
                description="로그아웃 시 서비스를 이용하려면 다시 로그인이 필요합니다."
                onConfirm={logOutMutation}
              >
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                  className="flex items-center justify-start gap-2"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-xs">로그아웃</span>
                </DropdownMenuItem>
              </Alert>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
