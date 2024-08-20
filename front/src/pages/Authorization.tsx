import { useEffect } from "react";
import { getKakaoToken, getKakaoUserInfo } from "../util/api";

export default function Authorization() {
  const AUTHORIZATION_CODE: string = new URL(
    document.location.toString()
  ).searchParams.get("code") as string;

  /**
   * 카카오 로그인 처리
   * 토큰 발급 후 유저 정보 조회
   */
  const fetchUserData = async () => {
    try {
      const token = await getKakaoToken(AUTHORIZATION_CODE);
      await getKakaoUserInfo(token);
    } catch (error) {
      console.error("카카오 로그인 처리 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="text-2xl md:text-3xl font-bold">Log In</div>
        </div>
      </div>
    </>
  );
}
