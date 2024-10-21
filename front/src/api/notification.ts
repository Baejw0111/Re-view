import { authApiClient } from "@/api/util";
import { NotificationInfo } from "@/shared/types/interface";

/**
 * 알림 조회 함수
 * @returns 알림 리스트
 */
export const fetchNotifications = async (): Promise<NotificationInfo[]> => {
  const response = await authApiClient.get("/notification");
  console.log("알림 조회 성공:", response.data);
  return response.data;
};

/**
 * 알림 확인 시간 업데이트 함수
 */
export const updateNotificationCheckTime = async (): Promise<void> => {
  const checkTime = new Date().toISOString();
  const response = await authApiClient.post("/notification/check", {
    checkTime,
  });
  console.log("알림 확인 시간 업데이트 성공:", response.data);
};

/**
 * 알림 삭제 함수
 * @param notificationId 알림 ID
 */
export const deleteNotification = async (
  notificationId: string
): Promise<void> => {
  const response = await authApiClient.delete(
    `/notification/${notificationId}`
  );
  console.log("알림 삭제 성공:", response.data);
};
