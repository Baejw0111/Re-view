import { Button } from "@/shared/shadcn-ui/button";
import { Bell } from "lucide-react";

export default function NotificationButton() {
  return (
    <Button size="icon">
      <Bell />
    </Button>
  );
}
