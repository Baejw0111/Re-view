import { Link } from "react-router-dom";
import { Button } from "@/shared/shadcn-ui/button";
import { PencilLine } from "lucide-react";
import TooltipWrapper from "@/shared/original-ui/TooltipWrapper";

export default function WriteReviewButton() {
  return (
    <TooltipWrapper tooltipText="리뷰 작성">
      <Link to="/write">
        <Button variant="ghost" size="icon">
          <PencilLine />
        </Button>
      </Link>
    </TooltipWrapper>
  );
}
