import { Button } from "@/shared/shadcn-ui/button";
import { Bell } from "lucide-react";

export default function NotificationButton() {
  return (
    <Button variant="ghost" size="icon">
      <Bell />
    </Button>
  );
}
