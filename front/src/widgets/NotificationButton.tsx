import { useState, useEffect } from "react";
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
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchNotifications,
  updateNotificationCheckTime,
} from "@/api/notification";
import NotificationBox from "@/features/interaction/NotificationBox";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/state/store/userInfoSlice";
import { setIsNotificationOpen } from "@/state/store/notificationOpenSlice";

export default function NotificationButton() {
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const dispatch = useDispatch();
  const isNotificationOpen = useSelector(
    (state: RootState) => state.notificationOpen.isNotificationOpen
  );
  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications(),
  });

  const { mutate: updateCheckTime } = useMutation({
    mutationFn: () => updateNotificationCheckTime(),
    onSuccess: () => {
      dispatch(
        setUserInfo({
          ...userInfo,
          notificationCheckTime: new Date().toISOString(),
        })
      );
    },
  });

  const [unCheckedNotifications, setUnCheckedNotifications] = useState(0);

  const handleNotificationOpenChange = () => {
    dispatch(setIsNotificationOpen(!isNotificationOpen));
  };

  useEffect(() => {
    if (userInfo && userInfo.kakaoId && notifications) {
      // 알림 창이 열려있으면 알림 개수 초기화
      if (isNotificationOpen) setUnCheckedNotifications(0);
      else {
        // 알림 창이 닫혀있으면 알림 개수 계산
        const unChecked = notifications?.filter(
          (notification) =>
            new Date(notification.time).getTime() >
            new Date(userInfo.notificationCheckTime).getTime()
        ).length;

        setUnCheckedNotifications(unChecked);
      }
    }
  }, [userInfo, notifications, isNotificationOpen]);

  return (
    <DropdownMenu
      open={isNotificationOpen}
      onOpenChange={handleNotificationOpenChange}
      modal={false}
    >
      <TooltipWrapper tooltipText="알림">
        <DropdownMenuTrigger asChild>
          <Button
            className="relative shrink-0"
            variant="ghost"
            size="icon"
            onClick={() => updateCheckTime()}
          >
            <Bell className={`${isNotificationOpen ? "fill-current" : ""}`} />
            {unCheckedNotifications > 0 && (
              <div className="absolute bg-red-600 dark:bg-red-700 text-white -top-1 -right-1 px-1 min-w-5 h-5 rounded-full flex items-center justify-center text-xs">
                {unCheckedNotifications}
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
      </TooltipWrapper>
      <DropdownMenuContent
        className="w-80 md:w-96"
        align="end"
        collisionPadding={20}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuLabel>알림</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="h-[300px]">
          {notifications && notifications.length > 0 ? (
            <ScrollArea className="h-full">
              {notifications.map((notification, index) => (
                <DropdownMenuItem
                  key={index}
                  className="flex flex-col items-start"
                >
                  <NotificationBox notificationInfo={notification} />
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          ) : (
            <div className="h-full flex justify-center items-center text-muted-foreground">
              알림이 없습니다.
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
        <Link to="/notifications">
          <DropdownMenuItem className="flex items-center justify-center w-full text-blue-500 cursor-pointer">
            모든 알림 보기
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
