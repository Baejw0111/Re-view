import { Button } from "@/components/ui/button";
import { PencilLine } from "lucide-react";

export default function ReviewModalButton() {
  return (
    <Button className="fixed top-4 right-4" size="icon">
      <PencilLine />
    </Button>
  );
}
