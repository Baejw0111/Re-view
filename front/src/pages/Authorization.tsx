import { useEffect } from "react";
import { getKakaoToken } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Authorization() {
  const navigate = useNavigate();
  const AUTHORIZATION_CODE: string = new URL(
    document.location.toString()
  ).searchParams.get("code") as string;

  // 카카오 로그인 처리
  const { mutate, isPending } = useMutation({
    mutationFn: async () => await getKakaoToken(AUTHORIZATION_CODE),
    onSuccess: () => {
      // 유저 정보를 자동으로 가져오게 하기 위해 페이지를 새로고침하며 이동
      window.location.href = "/";
    },
    onError: () => {
      toast.error("로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      navigate("/login");
    },
  });

  useEffect(() => {
    mutate();
  }, []);

  if (isPending) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="text-2xl md:text-3xl font-bold m-8">
          로그인 처리 중...
        </div>
      </div>
    );
  }

  return null;
}
