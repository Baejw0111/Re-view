import PageTemplate from "@/shared/original-ui/PageTemplate";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router";
import NotificationBox from "@/features/interaction/NotificationBox";
import { NotificationInfo } from "@/shared/types/interface";

export default function Notification() {
  const initialData = useLoaderData() as NotificationInfo[];

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    initialData,
  });

  return (
    <PageTemplate>
      <div className="max-w-xl mx-auto bg-background rounded-lg overflow-hidden">
        {notifications.length > 0 ? (
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
      </div>
    </PageTemplate>
  );
}
