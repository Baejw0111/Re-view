import { Button } from "@/shared/shadcn-ui/button";
import { PencilLine } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreateReviewButton() {
  const navigate = useNavigate();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => navigate("/create-review")}
    >
      <PencilLine />
    </Button>
  );
}
