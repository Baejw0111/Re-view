import KakaoLoginButton from "@/features/auth/KakaoLoginButton";

export default function AuthError() {
  return (
    <div className="flex flex-col gap-8 items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold">로그인이 필요합니다</h1>
      <p className="text-lg text-muted-foreground">
        이 페이지에 접근하려면 로그인이 필요합니다. 계속하려면 로그인해 주세요.
      </p>
      <KakaoLoginButton />
    </div>
  );
}
