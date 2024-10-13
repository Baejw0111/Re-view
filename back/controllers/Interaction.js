import {
  CommentModel,
  UserModel,
  ReviewModel,
  NotificationModel,
} from "../utils/Model.js";
import asyncHandler from "../utils/ControllerUtils.js";

let clients = new Map();

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
const sendEventToClient = (userId) => {
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
 * 알림 조회 API
 * @returns 알림 리스트
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await NotificationModel.find({
    kakaoId: req.userId,
  });
  res.status(200).json(notifications);
}, "알림 조회");

/**
 * 유저 정보 조회 API
 */
export const getUserInfoById = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const user = await UserModel.findOne({ kakaoId: userId });
  res.status(200).json(user);
}, "유저 정보 조회");

/**
 * 유저가 작성한 댓글 조회 API
 * @returns 유저가 작성한 댓글 목록
 */
export const getUserComments = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const comments = await CommentModel.find({ authorId: userId });
  res.status(200).json(comments);
}, "유저가 작성한 댓글 조회");

/**
 * 리뷰 댓글 조회 API
 * @returns 리뷰 댓글 목록
 */
export const getComments = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;
  const comments = await CommentModel.find({ reviewId });
  res.status(200).json(comments);
}, "댓글 조회");

/**
 * 리뷰 추천 API
 */
export const addLike = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;

  // 리뷰 추천 수 증카
  const review = await ReviewModel.findByIdAndUpdate(reviewId, {
    $inc: { likesCount: 1 },
  });

  // 유저 추천 리뷰 목록에 추가
  await UserModel.findOneAndUpdate(
    { kakaoId: req.userId },
    {
      $push: { likedReviews: reviewId },
    }
  );

  // 리뷰의 추천 수가 10의 배수인 경우 알림 생성
  if (review.likesCount !== 0 && review.likesCount % 10 === 0) {
    await NotificationModel.create({
      kakaoId: review.authorId,
      reviewId,
      category: "like",
    });
  }

  res.status(200).json({ message: "추천 완료!" });
}, "리뷰 추천");

/**
 * 리뷰 댓글 추가 API
 */
export const addComment = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;
  const authorId = req.userId;

  // 댓글 생성
  const comment = await CommentModel.create({
    authorId,
    reviewId,
    content: req.body.comment,
  });

  // 리뷰 댓글 수 증가
  const review = await ReviewModel.findByIdAndUpdate(reviewId, {
    $inc: { commentsCount: 1 },
  });

  // 알림 생성
  await NotificationModel.create({
    kakaoId: review.authorId,
    commentId: comment._id,
    reviewId,
    category: "comment",
  });

  // 새로운 댓글 이벤트 전송
  sendEventToClient(review.authorId);

  res.status(200).json({ message: "댓글 추가 완료" });
}, "리뷰 댓글 추가");

/**
 * 리뷰 추천 취소 API
 */
export const unLike = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;
  await ReviewModel.findByIdAndUpdate(reviewId, {
    $inc: { likesCount: -1 },
  });
  await UserModel.findOneAndUpdate(
    { kakaoId: req.userId },
    {
      $pull: { likedReviews: reviewId },
    }
  );
  res.status(200).json({ message: "추천 삭제 완료" });
}, "리뷰 추천 취소");

/**
 * 리뷰 댓글 삭제 API
 */
export const deleteComment = asyncHandler(async (req, res) => {
  const { id: commentId } = req.params;
  const { reviewId } = await CommentModel.findById(commentId);

  await CommentModel.findByIdAndDelete(commentId); // 댓글 삭제

  // 리뷰 댓글 수 감소
  await ReviewModel.findByIdAndUpdate(reviewId, {
    $inc: { commentsCount: -1 },
  });

  // 알림 삭제
  await NotificationModel.findOneAndDelete({ commentId });

  res.status(200).json({ message: "댓글 삭제 완료" });
}, "리뷰 댓글 삭제");
