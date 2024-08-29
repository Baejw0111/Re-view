import { Button } from "@/shared/shadcn-ui/button";
import { KAKAO_REST_API_KEY, KAKAO_REDIRECT_URI } from "@/shared/constants";

export default function KakaoLoginButton() {
  const KAKAO_OAUTH_URL =
    "https://kauth.kakao.com/oauth/authorize?response_type=code";

  return (
    <Button
      className="h-9 w-[140px] font-semibold bg-yellow-300 text-black hover:bg-yellow-400"
      onClick={() =>
        (window.location.href = `${KAKAO_OAUTH_URL}&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}`)
      }
    >
      카카오 로그인
    </Button>
  );
}
