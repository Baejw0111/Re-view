import { useEffect } from "react";
import { getKakaoToken, getLoginUserInfo } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/shared/shadcn-ui/button";

export default function Authorization() {
  const navigate = useNavigate();
  const AUTHORIZATION_CODE: string = new URL(
    document.location.toString()
  ).searchParams.get("code") as string;

  // 카카오 로그인 처리
  const { mutate, isPending, isError } = useMutation({
    mutationFn: async () => {
      await getKakaoToken(AUTHORIZATION_CODE);
      return await getLoginUserInfo();
    },
    onSuccess: (userInfo) => {
      if (userInfo.nickname) {
        window.location.href = "/";
      } else {
        window.location.href = "/onboarding";
      }
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  if (isPending) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="text-2xl md:text-3xl font-bold m-8">
          로그인 처리 중...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full px-4 py-6 md:py-4">
        <div className="text-2xl md:text-3xl font-bold m-8">
          로그인 처리 중 오류가 발생했습니다.
        </div>
        <Button onClick={() => navigate("/")}>홈으로 돌아가기</Button>
      </div>
    );
  }

  return null;
}
