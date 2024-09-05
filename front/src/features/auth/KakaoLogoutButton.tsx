import { Button } from "@/shared/shadcn-ui/button";
import { logOutKakao } from "@/api/kakaoAuth";
import { LogOutIcon } from "lucide-react";
import { persistor } from "@/state/store/index";

export default function KakaoLogoutButton() {
  const handleLogOut = async () => {
    await logOutKakao();
    await persistor.purge(); // 로그아웃 시 redux-persist가 관리하는 모든 상태 초기화
    window.location.href = "/";
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleLogOut}>
      <LogOutIcon />
    </Button>
  );
}
