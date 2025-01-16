import { useEffect } from "react";
import { getToken } from "@/api/auth";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { addSocialProvider } from "@/api/auth";
import { AxiosError } from "axios";

export default function Authorization({
  addSocialLogin = false,
}: {
  addSocialLogin?: boolean;
}) {
  const navigate = useNavigate();
  const { provider } = useParams();
  const AUTHORIZATION_CODE: string = new URL(
    document.location.toString()
  ).searchParams.get("code") as string;

  // 소셜 로그인 처리
  const { mutate: socialLoginMutate, isPending: socialLoginIsPending } =
    useMutation({
      mutationFn: async () =>
        await getToken(provider as string, AUTHORIZATION_CODE),
      onSuccess: () => {
        navigate("/");
      },
      onError: () => {
        toast.error("로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
        navigate("/login");
      },
    });

  // 소셜 로그인 추가 연동
  const { mutate: socialLoginAddMutate, isPending: socialLoginAddIsPending } =
    useMutation({
      mutationFn: async () =>
        await addSocialProvider(provider as string, AUTHORIZATION_CODE),
      onSuccess: () => {
        navigate("/settings");
      },
      onError: (error: AxiosError<{ message: string }>) => {
        toast.error("소셜 로그인 추가 연동 중 오류 발생:", {
          description: error.response?.data?.message,
        });
      },
    });

  useEffect(() => {
    if (addSocialLogin) {
      socialLoginAddMutate();
    } else {
      socialLoginMutate();
    }
  }, []);

  if (socialLoginIsPending || socialLoginAddIsPending) {
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
