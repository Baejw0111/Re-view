import { Button } from "@/shared/shadcn-ui/button";
import { Bell } from "lucide-react";
import TooltipWrapper from "@/shared/original-ui/TooltipWrapper";

export default function NotificationButton() {
  return (
    <TooltipWrapper tooltipText="알림">
      <Button variant="ghost" size="icon">
        <Bell />
      </Button>
    </TooltipWrapper>
  );
}
