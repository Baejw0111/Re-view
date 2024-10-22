import { UserModel, NotificationModel } from "../utils/Model.js";
import asyncHandler from "../utils/ControllerUtils.js";

let clients = new Map(); // 사용자 ID를 키로 하는 클라이언트 맵

/**
 * 알림 SSE 연결
 */
export const connectNotificationSSE = asyncHandler((req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // 클라이언트를 Map에 추가
  const userId = Number(req.query.userId); // 클라이언트에서 사용자 ID를 쿼리 파라미터로 전달
  if (userId) {
    if (!clients.has(userId)) {
      clients.set(userId, []); // 같은 사용자가 여러 클라이언트로 접속할 수 있도록 사용자 ID를 키로 하는 배열을 생성
    }
    clients.get(userId).push(res); // 사용자 ID를 키로 하는 배열에 클라이언트 추가
  }

  req.on("close", () => {
    // 클라이언트가 연결을 종료하면 Map에서 제거
    const userClients = clients.get(userId);
    if (userClients) {
      const index = userClients.indexOf(res);
      if (index !== -1) {
        userClients.splice(index, 1);
      }
      if (userClients.length === 0) {
        clients.delete(userId);
      }
    }
  });
});

/**
 * 클라이언트에 이벤트 전송 함수
 * @param {number} userId - 사용자 ID
 */
export const sendEventToClient = (userId) => {
  const userClients = clients.get(userId);
  if (userClients) {
    userClients.forEach((client) => {
      client.write(
        `data: new notification\n\n` // 줄바꿈 문자를 두개 쓰는 이유는 이벤트의 끝을 알려주기 위함
      );
    });
  }
};

/**
 * 알림 조회
 * @returns 알림 리스트
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await NotificationModel.find({
    kakaoId: req.userId,
  }).sort({ time: -1 });
  res.status(200).json(notifications);
}, "알림 조회");

/**
 * 유저 알림 확인 시간 업데이트
 */
export const updateNotificationCheckTime = asyncHandler(async (req, res) => {
  const { checkTime } = req.body;
  await UserModel.findOneAndUpdate(
    { kakaoId: req.userId },
    { $set: { notificationCheckTime: checkTime } }
  );
  res.status(200).json({ message: "알림 확인 시간 업데이트 완료" });
}, "알림 확인 시간 업데이트");

/**
 * 알림 삭제
 */
export const deleteNotification = asyncHandler(async (req, res) => {
  const { id: notificationId } = req.params;
  await NotificationModel.findByIdAndDelete(notificationId);
  res.status(200).json({ message: "알림 삭제 완료" });
}, "알림 삭제");
