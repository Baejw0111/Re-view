import { useState } from "react";
import { Button } from "@/shared/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/shadcn-ui/dropdown-menu";
import { logOutKakao, deleteUserAccount } from "@/api/auth";
import {
  KAKAO_REST_API_KEY,
  KAKAO_LOGOUT_REDIRECT_URI,
} from "@/shared/constants";
import {
  Settings,
  Sun,
  Moon,
  LogOutIcon,
  UserRoundX,
  UserCog,
  MessageSquare,
} from "lucide-react";
import TooltipWrapper from "@/shared/original-ui/TooltipWrapper";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/shared/shadcn-ui/dialog";
import EditUserProfile from "@/features/setting/EditUserProfile";
import { useTheme } from "@/state/theme/useTheme";
import { Textarea } from "@/shared/shadcn-ui/textarea";
import { sendUserFeedback } from "@/api/user";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function UserSetting() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    <>
      <DropdownMenu onOpenChange={setIsDropdownOpen} modal={false}>
        {/* 설정 버튼 */}
        <TooltipWrapper tooltipText="설정">
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings />
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

          {/* 프로필 편집 버튼 */}
          <DropdownMenuItem
            onClick={() => setIsProfileEditDialogOpen(true)}
            className="flex items-center justify-start gap-2"
          >
            <UserCog className="h-5 w-5" />
            <span className="text-xs">프로필 편집</span>
          </DropdownMenuItem>

          {/* 로그아웃 버튼 */}
          <DropdownMenuItem
            onClick={handleLogOut}
            className="flex items-center justify-start gap-2"
          >
            <LogOutIcon className="h-5 w-5" />
            <span className="text-xs">로그아웃</span>
          </DropdownMenuItem>

          {/* 피드백 버튼 */}
          <DropdownMenuItem
            onClick={() => setIsFeedbackDialogOpen(true)}
            className="flex items-center justify-start gap-2"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">피드백 보내기</span>
          </DropdownMenuItem>

          {/* 회원 탈퇴 버튼 */}
          <DropdownMenuItem
            onClick={handleDelete}
            className="flex items-center justify-start gap-2 text-destructive focus:text-destructive focus:bg-destructive/20 active:text-destructive active:bg-destructive/20"
          >
            <UserRoundX className="h-5 w-5" />
            <span className="text-xs">회원 탈퇴</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={isProfileEditDialogOpen && !isDropdownOpen}
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
        open={isFeedbackDialogOpen && !isDropdownOpen}
        onOpenChange={setIsFeedbackDialogOpen}
      >
        <DialogContent className="max-w-lg [&>button]:hidden">
          <DialogHeader className="text-left">
            <DialogTitle>피드백 보내기</DialogTitle>
          </DialogHeader>
          <DialogDescription hidden></DialogDescription>
          <form onSubmit={handleSubmitFeedback} className="flex flex-col gap-4">
            <Textarea
              placeholder="피드백을 입력해주세요."
              value={feedback}
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
