import { useState } from "react";
import { Badge } from "@/shared/shadcn-ui/badge";
import { Button } from "@/shared/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/shadcn-ui/dropdown-menu";
import { ScrollArea } from "@/shared/shadcn-ui/scroll-area";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import TooltipWrapper from "@/shared/original-ui/TooltipWrapper";
import { useQuery } from "@tanstack/react-query";
import { fetchNotifications } from "@/api/interaction";
import NotificationBox from "@/features/interaction/NotificationBox";

export default function NotificationButton() {
  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications(),
  });

  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <TooltipWrapper tooltipText="알림">
        <DropdownMenuTrigger asChild>
          <Button className="relative shrink-0" variant="ghost" size="icon">
            <Bell className={`${isOpen ? "fill-current" : ""}`} />
            <Badge className="absolute -top-1 -right-1 px-1 min-w-5 h-5 rounded-full flex items-center justify-center text-xs">
              {notifications?.length}
            </Badge>
          </Button>
        </DropdownMenuTrigger>
      </TooltipWrapper>
      <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
        <DropdownMenuLabel>알림</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px] max-w-xl">
          {notifications ? (
            notifications.map((notification, index) => (
              <DropdownMenuItem
                key={index}
                className="flex flex-col items-start p-4"
              >
                <NotificationBox {...notification} />
              </DropdownMenuItem>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              알림이 없습니다.
            </div>
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center">
          <Link
            to="/notifications"
            className="w-full text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          >
            모든 알림 보기
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
