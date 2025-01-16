import { Button } from "@/shared/shadcn-ui/button";
import { socialLogin } from "@/api/auth";

export default function SocialLoginButton({ provider }: { provider: string }) {
  const buttonVariants: Record<string, [string, string]> = {
    google: [
      `bg-[#FFFFFF] hover:bg-[#FFFFFF]/80 active:bg-[#FFFFFF]/80 focus-visible:bg-[#FFFFFF]/80`,
      "Google",
    ],
    kakao: [
      `bg-[#FEE500] hover:bg-[#FEE500]/80 active:bg-[#FEE500]/80 focus-visible:bg-[#FEE500]/80`,
      "카카오",
    ],
    naver: [
      `bg-[#03C75A] hover:bg-[#03C75A]/80 active:bg-[#03C75A]/80 focus-visible:bg-[#03C75A]/80`,
      "네이버",
    ],
  };

  return (
    <Button
      className={`h-10 w-full gap-2 ${buttonVariants[provider]} text-black/85 text-xs font-semibold`}
      onClick={() => socialLogin(provider)}
      disabled={provider === "naver"}
    >
      <img
        src={`/${provider}-symbol.svg`}
        alt={provider}
        className="h-4 w-4 shrink-0"
      />
      <span className="text-sm font-bold leading-none tracking-tighter">
        {buttonVariants[provider][1]}로 로그인
      </span>
    </Button>
  );
}
