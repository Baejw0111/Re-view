import { Button } from "@/shared/shadcn-ui/button";
import {
  KAKAO_OAUTH_URL,
  KAKAO_REST_API_KEY,
  KAKAO_REDIRECT_URI,
} from "@/shared/constants";

export default function KakaoLoginButton() {
  return (
    <Button
      className="h-9 w-32 gap-2 bg-[#FEE500] hover:bg-[#FEE500]/80 active:bg-[#FEE500]/80 text-black/85 text-xs font-semibold"
      onClick={() =>
        (window.location.href = `${KAKAO_OAUTH_URL}&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}`)
      }
    >
      <img
        src="/kakao-symbol.svg"
        alt="Kakao Symbol"
        className="w-4 h-4 shrink-0"
      />
      카카오 로그인
    </Button>
  );
}
