import { Button } from "@/shared/shadcn-ui/button";
import { PencilLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TooltipWrapper from "@/shared/original-ui/TooltipWrapper";

export default function CreateReviewButton() {
  const navigate = useNavigate();
  return (
    <TooltipWrapper tooltipText="리뷰 작성">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate("/create-review")}
      >
        <PencilLine />
      </Button>
    </TooltipWrapper>
  );
}
