import { Link } from "react-router-dom";
import { Button } from "@/shared/shadcn-ui/button";
import { Home } from "lucide-react";

export default function NotFoundError() {
  return (
    <div className="flex flex-col gap-8 items-center justify-center min-h-screen text-center">
      <h2 className="text-4xl font-bold">페이지를 찾을 수 없습니다</h2>
      <p className="text-xl text-muted-foreground">
        죄송합니다. 요청하신 페이지를 찾을 수 없습니다.
      </p>
      <div className="flex justify-center">
        <Button asChild variant="secondary" className="flex items-center">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            홈으로
          </Link>
        </Button>
      </div>
    </div>
  );
}
