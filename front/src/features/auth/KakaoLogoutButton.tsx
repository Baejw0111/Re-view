import { Button } from "@/shared/shadcn-ui/button";
import { logOutKakao } from "@/api/kakaoAuth";
import { LogOutIcon } from "lucide-react";
import { persistor } from "@/state/store/index";
import TooltipWrapper from "@/shared/original-ui/TooltipWrapper";
import {
  KAKAO_REST_API_KEY,
  KAKAO_LOGOUT_REDIRECT_URI,
} from "@/shared/constants";

export default function KakaoLogoutButton() {
  const handleLogOut = async () => {
    await logOutKakao();
    await persistor.purge(); // 로그아웃 시 redux-persist가 관리하는 모든 상태 초기화
    window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${KAKAO_REST_API_KEY}&logout_redirect_uri=${KAKAO_LOGOUT_REDIRECT_URI}`;
  };

  return (
    <TooltipWrapper tooltipText="로그아웃">
      <Button variant="ghost" size="icon" onClick={handleLogOut}>
        <LogOutIcon />
      </Button>
    </TooltipWrapper>
  );
}
