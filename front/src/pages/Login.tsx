import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/shadcn-ui/card";
import SocialLoginButton from "@/features/auth/SocialLoginButton";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-96 flex flex-col gap-4">
        <CardHeader>
          <CardTitle className="text-2xl">로그인</CardTitle>
          <CardDescription>소셜 계정으로 로그인하세요.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <SocialLoginButton provider="google" />
          <SocialLoginButton provider="kakao" />
          <SocialLoginButton provider="naver" />
        </CardContent>
      </Card>
    </div>
  );
}
