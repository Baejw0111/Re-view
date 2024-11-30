import { Link } from "react-router-dom";
import { Button } from "@/shared/shadcn-ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFoundError() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center text-white">
        <h1 className="text-9xl font-extrabold mb-4">404</h1>
        <h2 className="text-4xl font-bold mb-8">페이지를 찾을 수 없습니다</h2>
        <p className="text-xl mb-8">
          죄송합니다. 요청하신 페이지를 찾을 수 없습니다.
        </p>
        <div className="flex justify-center space-x-4">
          <Button asChild variant="secondary" className="flex items-center">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              홈으로
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex items-center">
            <Link to="javascript:history.back()">
              <ArrowLeft className="mr-2 h-4 w-4" />
              이전 페이지
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
