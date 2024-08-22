import { Button } from "@/components/ui/button";
import { logOutKakao } from "@/util/api";
import { LogOutIcon } from "lucide-react";
import { persistor } from "@/store/index";

export default function KakaoLogoutButton() {
  const handleLogOut = async () => {
    await logOutKakao();
    await persistor.purge(); // 로그아웃 시 redux-persist가 관리하는 모든 상태 초기화
    window.location.href = "/";
  };

  return (
    <Button size="icon" onClick={handleLogOut}>
      <LogOutIcon />
    </Button>
  );
}
