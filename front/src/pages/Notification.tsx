import PageTemplate from "@/shared/original-ui/PageTemplate";
import { Card, CardContent } from "@/shared/shadcn-ui/card";
import { ScrollArea } from "@/shared/shadcn-ui/scroll-area";
import { Loader2Icon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotifications } from "@/api/interaction";
import NotificationBox from "@/features/interaction/NotificationBox";

export default function Notification() {
  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications(),
  });

  return (
    <PageTemplate pageName="모든 알림">
      <Card className="max-w-3xl mx-auto flex-grow overflow-hidden">
        <CardContent className="p-0">
          <ScrollArea className="h-[80vh] rounded-md">
            {notifications ? (
              notifications.map((notification, index) => (
                <NotificationBox key={index} {...notification} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                알림이 없습니다.
              </div>
            )}
            <div className="flex justify-center items-center p-4 border-t">
              <Loader2Icon className="animate-spin mr-2" />더 많은 알림 불러오는
              중...
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </PageTemplate>
  );
}
