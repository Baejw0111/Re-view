import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import PageTemplate from "@/shared/original-ui/PageTemplate";
import { Loader2Icon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotifications } from "@/api/notification";
import NotificationBox from "@/features/interaction/NotificationBox";
import { API_URL } from "@/shared/constants";

export default function Notification() {
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const { data: notifications, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications(),
  });

  useEffect(() => {
    if (!userInfo || !userInfo.kakaoId) return;

    const eventSource = new EventSource(
      `${API_URL}/notification/stream?userId=${userInfo.kakaoId}`
    );

    eventSource.onmessage = () => {
      console.log("새로운 알림");
      refetch(); // 새로운 알림이 올 때마다 fetchNotifications API 요청
    };

    return () => {
      eventSource.close();
    };
  }, [userInfo, refetch]);

  return (
    <PageTemplate pageName="모든 알림">
      <div className="max-w-3xl mx-auto">
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
