import { Button } from "@/components/ui/button";

export default function Test() {
  const KAKAO_OAUTH_URL =
    "https://kauth.kakao.com/oauth/authorize?response_type=code";
  const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  return (
    <>
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="text-2xl md:text-3xl font-bold">Test Page</div>
        </div>
        {/* 컴포넌트 시작 */}
        <Button
          className="font-semibold bg-yellow-300 text-black hover:bg-yellow-400"
          onClick={() =>
            (window.location.href = `${KAKAO_OAUTH_URL}&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}`)
          }
        >
          카카오 로그인
        </Button>
        {/* 컴포넌트 끝*/}
      </div>
    </>
  );
}
