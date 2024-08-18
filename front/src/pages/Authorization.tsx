import { useEffect } from "react";
import { getKakaoToken } from "../util/api";

export default function Authorization() {
  const AUTHORIZATION_CODE: string = new URL(
    document.location.toString()
  ).searchParams.get("code") as string;

  useEffect(() => {
    getKakaoToken(AUTHORIZATION_CODE);
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
