import { Button } from "@/shared/shadcn-ui/button";

export default function KakaoLoginButton() {
  const KAKAO_OAUTH_URL =
    "https://kauth.kakao.com/oauth/authorize?response_type=code";
  const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  return (
    <Button
      className="h-9 w-[140px] font-semibold bg-yellow-300 text-black hover:bg-yellow-400"
      onClick={() =>
        (window.location.href = `${KAKAO_OAUTH_URL}&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}`)
      }
    >
      카카오 로그인
    </Button>
  );
}
