import { Button } from "@/shared/shadcn-ui/button";
import { PencilLine } from "lucide-react";

export default function CreateReviewButton() {
  return (
    <Button size="icon">
      <PencilLine />
    </Button>
  );
}
