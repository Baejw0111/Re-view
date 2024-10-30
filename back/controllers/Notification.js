import {
  UserModel,
  NotificationModel,
  CommentModel,
  ReviewModel,
} from "../utils/Model.js";
import asyncHandler from "../utils/ControllerUtils.js";

const clients = new Map(); // 사용자 ID를 키로 하는 클라이언트 맵

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

  /**
   * 알림 포맷팅
   * @param {Notification} notification - 알림 객체
   * @returns {Promise<Object>} - 포맷팅된 알림 객체
   */
  const formatNotification = async (notification) => {
    const comment = notification.commentId
      ? await CommentModel.findById(notification.commentId)
      : null;

    const author = comment
      ? await UserModel.findOne({ kakaoId: comment.authorId })
      : null;

    const review = await ReviewModel.findById(notification.reviewId);

    const isLikeNotification = notification.category === "like";

    return {
      _id: notification._id,
      time: notification.time,
      commentId: notification.commentId,
      reviewId: notification.reviewId,
      category: notification.category,
      profileImage: author ? author.profileImage : "public/logo.svg",
      nickname: author ? author.nickname : "시스템",
      title: isLikeNotification
        ? "인기 리뷰 선정!"
        : author?.nickname || "시스템",
      reviewTitle: review.title,
      content: isLikeNotification
        ? "작성하신 리뷰가 인기 리뷰로 선정되었습니다."
        : comment?.content,
      reviewThumbnail: review.images[0],
    };
  };

  const notificationList = await Promise.all(
    notifications.map(formatNotification)
  );

  res.status(200).json(notificationList);
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
