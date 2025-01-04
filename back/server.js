import serverless from "serverless-http";
import express from "express"; // 서버 구축용 프레임워크
import compression from "compression";
import cors from "cors"; // cors 관리
import "dotenv/config"; // .env 파일에서 바로 환경 변수 로드
import cookieParser from "cookie-parser";
import helmet from "helmet"; // 보안 헤더 설정
import {
  upload,
  checkFormFieldsExistence,
  verifyFormFields,
  handleMulterError,
} from "./utils/Upload.js";
import {
  getKakaoToken,
  verifyKakaoAccessToken,
  refreshKakaoAccessToken,
  checkAuth,
  disableCache,
  getKakaoUserInfo,
  logOutKakao,
  deleteUserAccount,
} from "./controllers/Auth.js";
import {
  createReview,
  getLatestFeed,
  getPopularFeed,
  getReviewById,
  updateReview,
  deleteReview,
  searchReviews,
} from "./controllers/Review.js";
import {
  getUserInfoById,
  searchUsers,
  getUserReviewList,
  getUserCommentList,
  getUserLikedList,
  updateUserInfo,
  userFeedback,
  userReportReview,
  userReportComment,
} from "./controllers/User.js";
import {
  getNotifications,
  connectNotificationSSE,
  updateNotificationCheckTime,
  deleteNotification,
} from "./controllers/Notification.js";
import {
  getUserLiked,
  addLike,
  unLike,
  getLikeCount,
} from "./controllers/Like.js";
import {
  addComment,
  getCommentById,
  getReviewCommentList,
  getCommentCount,
  deleteComment,
} from "./controllers/Comment.js";
import { getPopularTags, searchRelatedTags } from "./controllers/Tag.js";
import { connectDB } from "./utils/Model.js";

const app = express(); // express 인스턴스 생성
const { FRONT_URL, TEST_FRONT_URL } = process.env;

// 미들웨어 설정
app.use(express.json()); //json 데이터 파싱
app.use(compression()); // 서버 응답 압축 전송
app.use(express.urlencoded({ extended: true })); // form 데이터(x-www-form-urlencoded) 파싱(extended 옵션 정의 안해주면 에러 터짐)
app.use(
  cors({
    origin: [FRONT_URL, TEST_FRONT_URL],
    credentials: true,
  })
); // cors 에러 방지
app.use(cookieParser()); // cookie 파싱
app.use(helmet()); // 보안 헤더 설정

// 카카오 로그인 관련 API
app.post("/auth/kakao/login", getKakaoToken); // 카카오 토큰 요청 API
app.post("/auth/kakao/refresh", refreshKakaoAccessToken); // 카카오 액세스 토큰 재발급 API
app.get("/auth/kakao/check", disableCache, checkAuth); // 로그인 여부 확인 API
app.post("/auth/kakao/logout", verifyKakaoAccessToken, logOutKakao); // 카카오 로그아웃 API
app.get(
  "/auth/kakao/user",
  verifyKakaoAccessToken,
  disableCache,
  getKakaoUserInfo
); // 카카오 유저 정보 조회 API
app.delete("/auth/kakao/delete", verifyKakaoAccessToken, deleteUserAccount); // 카카오 유저 계정 삭제 API

// 리뷰 관련 API
app.get("/review/latest", getLatestFeed); // 최신 리뷰 조회 API
app.get("/review/popular", getPopularFeed); // 인기 리뷰 조회 API
app.get("/review/:id", getReviewById); // 특정 리뷰 조회 API
app.get("/review/:id/comments/count", getCommentCount); // 리뷰의 댓글 수 조회 API
app.get("/review/:id/comments", getReviewCommentList); // 리뷰의 댓글 목록 조회 API
app.post(
  "/review",
  verifyKakaoAccessToken,
  upload.array("images", 5),
  handleMulterError,
  checkFormFieldsExistence,
  verifyFormFields,
  createReview
); // 리뷰 등록 API
app.patch(
  "/review/:id",
  verifyKakaoAccessToken,
  upload.array("images", 5),
  handleMulterError,
  verifyFormFields,
  updateReview
); // 리뷰 수정 API
app.delete("/review/:id", verifyKakaoAccessToken, deleteReview); // 리뷰 삭제 API

// 유저 정보 관련 API
app.get("/user/:id", getUserInfoById); // 유저 정보 조회 API
app.get("/user/:id/reviews", getUserReviewList); // 유저가 작성한 리뷰 목록 조회 API
app.get("/user/:id/comments", getUserCommentList); // 유저가 작성한 댓글 목록 조회 API
app.get("/user/:id/liked", getUserLikedList); // 유저가 추천한 리뷰 목록 조회 API
app.put(
  "/user/info",
  verifyKakaoAccessToken,
  upload.single("profileImage"),
  handleMulterError,
  updateUserInfo
); // 유저 정보 수정 API
app.post("/user/feedback", verifyKakaoAccessToken, userFeedback); // 유저 피드백 전송 API
app.post("/user/report/review", verifyKakaoAccessToken, userReportReview); // 리뷰 신고 API
app.post("/user/report/comment", verifyKakaoAccessToken, userReportComment); // 댓글 신고 API

// 알림 관련 API
app.get("/notification", verifyKakaoAccessToken, getNotifications); // 알림 조회 API
// app.get("/notification/stream", verifyKakaoAccessToken, connectNotificationSSE); // 알림 SSE API
app.post(
  "/notification/check",
  verifyKakaoAccessToken,
  updateNotificationCheckTime
); // 알림 확인 시간 업데이트 API
app.delete("/notification/:id", verifyKakaoAccessToken, deleteNotification); // 알림 삭제 API

// 댓글 관련 API
app.get("/comment/:id", getCommentById); // 특정 댓글 조회 API
app.post("/comment/:id", verifyKakaoAccessToken, addComment); // 리뷰 댓글 등록 API
app.delete("/comment/:id", verifyKakaoAccessToken, deleteComment); // 리뷰 댓글 삭제 API

// 추천 관련 API
app.patch("/like/:id", verifyKakaoAccessToken, addLike); // 리뷰 추천 API
app.get("/like/:id", verifyKakaoAccessToken, getUserLiked); // 사용자의 리뷰 추천 여부 조회 API
app.get("/like/:id/count", getLikeCount); // 리뷰 추천 수 조회 API
app.patch("/unlike/:id", verifyKakaoAccessToken, unLike); // 리뷰 추천 취소 API

// 태그 관련 API
app.get("/tag/popular", getPopularTags); // 인기 태그 조회 API
app.get("/tag/search", searchRelatedTags); // 검색어 연관 태그 조회 API

// 검색 관련 API
app.get("/search/reviews", searchReviews); // 리뷰 검색 결과 조회 API
app.get("/search/users", searchUsers); // 유저 검색 결과 조회 API

export const handler = async (event, context) => {
  try {
    await connectDB();
    return await serverless(app)(event, context);
  } catch (err) {
    console.error("Lambda Error:", err); // CloudWatch 로그에서 확인 가능
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error", error: err }),
    };
  }
};
