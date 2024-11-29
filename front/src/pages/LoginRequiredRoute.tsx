import KakaoLoginButton from "@/features/auth/KakaoLoginButton";
import { useLoaderData } from "react-router-dom";
import { UserInfo } from "@/shared/types/interface";

export default function LoginRequiredRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const userInfo = useLoaderData() as UserInfo | null;

  return userInfo ? (
    <>{children}</>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-2xl font-bold mb-10">
        로그인 후 사용 가능한 기능입니다. 로그인 해주세요.
      </p>
      <KakaoLoginButton />
    </div>
  );
}
