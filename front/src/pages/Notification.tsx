import PageTemplate from "@/shared/original-ui/PageTemplate";
import { Loader2Icon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";
import NotificationBox from "@/features/interaction/NotificationBox";
import { NotificationInfo } from "@/shared/types/interface";

export default function Notification() {
  const initialData = useLoaderData() as NotificationInfo[];

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    initialData,
  });

  return (
    <PageTemplate pageName="모든 알림">
      <div className="max-w-xl mx-auto bg-background rounded-lg overflow-hidden">
        {notifications ? (
          notifications.map((notification, index) => (
            <NotificationBox
              key={index}
              className="px-4 md:px-6 hover:bg-muted active:bg-muted"
              notificationInfo={notification}
            />
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
      </div>
    </PageTemplate>
  );
}
