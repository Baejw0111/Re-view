import { useState } from "react";
import { Button } from "@/shared/shadcn-ui/button";
import TooltipWrapper from "@/shared/original-ui/TooltipWrapper";
import UserAvatar from "@/features/user/UserAvatar";
import { LoginUserInfo } from "@/shared/types/interface";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/state/theme/useTheme";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { sendUserFeedback } from "@/api/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/shadcn-ui/dropdown-menu";
import {
  Moon,
  Sun,
  UserRound,
  UserCog,
  LogOut,
  MessageSquare,
  UserRoundX,
  LogIn,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/shared/shadcn-ui/dialog";
import { Textarea } from "@/shared/shadcn-ui/textarea";
import EditUserProfile from "@/features/setting/EditUserProfile";
import { logOutKakao, deleteUserAccount } from "@/api/auth";
import Alert from "@/widgets/Alert";

export default function ProfileButton({
  userInfo,
}: {
  userInfo: LoginUserInfo;
}) {
  const navigate = useNavigate();
  const [isProfileEditDialogOpen, setIsProfileEditDialogOpen] = useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const [feedback, setFeedback] = useState("");

  const sendFeedbackMutation = useMutation({
    mutationFn: () => sendUserFeedback(feedback),
    onSuccess: () => {
      toast.success("피드백이 전송되었습니다.");
      setFeedback("");
      setIsFeedbackDialogOpen(false);
    },
  });

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendFeedbackMutation.mutateAsync();
  };

  /**
   * 테마 토글 함수
   */
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  /**
   * 로그아웃 함수
   */
  const handleLogOut = async () => {
    await logOutKakao();
    window.location.href = `/`;
  };

  /**
   * 회원 탈퇴 함수
   */
  const handleDelete = async () => {
    await deleteUserAccount();
    window.location.href = `/`;
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

          {userInfo.socialId === 0 ? (
            <>
              {/* 로그인 버튼 */}
              <DropdownMenuItem
                onClick={() => navigate("/login")}
                className="flex items-center justify-start gap-2"
              >
                <LogIn className="h-5 w-5" />
                <span className="text-xs">로그인</span>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              {/* 내 프로필 조회 */}
              <DropdownMenuItem
                className="flex items-center justify-start gap-2"
                asChild
              >
                <Link to={`/profile/${userInfo.socialId}`}>
                  <UserRound className="h-5 w-5" />
                  <span className="text-xs">내 프로필</span>
                </Link>
              </DropdownMenuItem>

              {/* 프로필 편집 버튼 */}
              <DropdownMenuItem
                onClick={() => setIsProfileEditDialogOpen(true)}
                className="flex items-center justify-start gap-2"
              >
                <UserCog className="h-5 w-5" />
                <span className="text-xs">프로필 편집</span>
              </DropdownMenuItem>

              {/* 로그아웃 버튼 */}
              <Alert
                title="로그아웃하시겠습니까?"
                description="로그아웃 시 서비스를 이용하려면 다시 로그인이 필요합니다."
                onConfirm={handleLogOut}
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

              {/* 피드백 버튼 */}
              <DropdownMenuItem
                onClick={() => setIsFeedbackDialogOpen(true)}
                className="flex items-center justify-start gap-2"
              >
                <MessageSquare className="h-5 w-5" />
                <span className="text-xs">피드백 보내기</span>
              </DropdownMenuItem>

              {/* 회원 탈퇴 버튼 */}
              <Alert
                title="서비스에서 탈퇴하시겠습니까?"
                description="탈퇴 후 모든 데이터는 삭제되며 복구가 불가능합니다."
                onConfirm={handleDelete}
              >
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="flex items-center justify-start gap-2 text-destructive focus:text-destructive focus:bg-destructive/20 active:text-destructive active:bg-destructive/20"
                >
                  <UserRoundX className="h-5 w-5" />
                  <span className="text-xs">회원 탈퇴</span>
                </DropdownMenuItem>
              </Alert>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={isProfileEditDialogOpen}
        onOpenChange={setIsProfileEditDialogOpen}
      >
        <DialogContent className="max-w-sm [&>button]:hidden">
          <DialogHeader className="text-left">
            <DialogTitle>프로필 편집</DialogTitle>
          </DialogHeader>

          <DialogDescription hidden></DialogDescription>

          {/* 프로필 편집 컴포넌트 */}
          <EditUserProfile
            submitFooter={(isUploading: boolean) => (
              <DialogFooter className="flex flex-row justify-end gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    취소
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isUploading}>
                  저장
                </Button>
              </DialogFooter>
            )}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isFeedbackDialogOpen}
        onOpenChange={setIsFeedbackDialogOpen}
      >
        <DialogContent className="max-w-lg [&>button]:hidden">
          <DialogHeader className="text-left">
            <DialogTitle>피드백 보내기</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            서비스 이용 중 발생한 버그, 또는 불편했던 점들을 작성해서
            보내주세요. 서비스 개선점에 대해서 자세하게 작성해주시면 더욱 좋은
            서비스를 제공하기 위해 노력하겠습니다.
          </DialogDescription>
          <form onSubmit={handleSubmitFeedback} className="flex flex-col gap-4">
            <Textarea
              placeholder="피드백을 입력해주세요."
              value={feedback}
              rows={5}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <DialogFooter className="flex flex-row justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  취소
                </Button>
              </DialogClose>
              <Button type="submit" disabled={feedback.length === 0}>
                제출
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
