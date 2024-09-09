import { useEffect } from "react";
import { getKakaoToken, getKakaoUserInfo } from "@/api/kakaoAuth";
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/state/store/userInfoSlice";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/shared/shadcn-ui/button";

export default function Authorization() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const AUTHORIZATION_CODE: string = new URL(
    document.location.toString()
  ).searchParams.get("code") as string;

  // 카카오 로그인 처리
  const kakaoLoginMutation = useMutation({
    mutationFn: async () => {
      await getKakaoToken(AUTHORIZATION_CODE);
      return await getKakaoUserInfo();
    },
    onSuccess: (responseData) => {
      const { isNewMember, nickname, profileImage, thumbnailImage } =
        responseData;
      dispatch(setUserInfo({ nickname, profileImage, thumbnailImage }));
      if (isNewMember) {
        navigate("/onboarding");
      } else {
        navigate("/");
      }
    },
  });

  useEffect(() => {
    kakaoLoginMutation.mutate();
  }, []);

  if (kakaoLoginMutation.isPending) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="text-2xl md:text-3xl font-bold m-8">
          로그인 처리 중...
        </div>
      </div>
    );
  }

  if (kakaoLoginMutation.isError) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="text-2xl md:text-3xl font-bold m-8">
          로그인 처리 중 오류가 발생했습니다.
        </div>
        <Button onClick={() => navigate("/")}>홈으로 돌아가기</Button>
      </div>
    );
  }

  return null;
}
