import KakaoLoginButton from "@/features/auth/KakaoLoginButton";

export default function LoginRequiredRoute({
  authenticated,
  children,
}: {
  authenticated: boolean;
  children: React.ReactNode;
}) {
  return !authenticated ? (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-2xl font-bold mb-10">
        로그인 후 사용 가능한 기능입니다. 로그인 해주세요.
      </p>
      <KakaoLoginButton />
    </div>
  ) : (
    <>{children}</>
  );
}
