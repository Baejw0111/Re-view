import { Link } from "react-router-dom";
import { Button } from "@/shared/shadcn-ui/button";
import { PencilLine } from "lucide-react";
import TooltipWrapper from "@/shared/original-ui/TooltipWrapper";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { toast } from "sonner";

export default function WriteReviewButton() {
  const kakaoId = useSelector((state: RootState) => state.userInfo.kakaoId);

  const handleWriteReviewButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (kakaoId === 0) {
      e.preventDefault();
      toast.error("로그인 후 이용해주세요.");

      return;
    }
  };

  return (
    <TooltipWrapper tooltipText="리뷰 작성">
      <Button
        onClick={handleWriteReviewButtonClick}
        variant="ghost"
        size="icon"
        className="shrink-0"
        asChild
      >
        <Link to="/write">
          <PencilLine />
        </Link>
      </Button>
    </TooltipWrapper>
  );
}
