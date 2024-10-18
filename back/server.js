// "nodemon server.js"로 서버 가동
import express from "express"; // 서버 구축용 프레임워크
import cors from "cors"; // cors 관리
import morgan from "morgan"; // 로그 출력용
import "dotenv/config"; // .env 파일에서 바로 환경 변수 로드
import cookieParser from "cookie-parser";
import {
  getFeed,
  getReviewsById,
  createReview,
  updateReview,
  deleteReview,
} from "./controllers/Review.js";
import {
  getKakaoToken,
  verifyKakaoAccessToken,
  refreshKakaoAccessToken,
  getKakaoUserInfo,
  logOutKakao,
  deleteUserAccount,
} from "./controllers/KakaoLogin.js";
import {
  getReviewCommentList,
  addLike,
  addComment,
  unLike,
  deleteComment,
  getUserInfoById,
  getUserComments,
  connectNotificationSSE,
  getNotifications,
  getCommentById,
  updateNotificationCheckTime,
  deleteNotification,
} from "./controllers/Interaction.js";
import { updateUserInfo } from "./controllers/UserSetting.js";
import { upload } from "./utils/Upload.js";

const app = express(); // express 인스턴스 생성
const { PORT } = process.env; // 로드된 환경변수는 process.env로 접근 가능

// 미들웨어 설정
app.use(express.json()); //json 데이터 파싱
app.use(express.urlencoded({ extended: true })); // form 데이터(x-www-form-urlencoded) 파싱(extended 옵션 정의 안해주면 에러 터짐)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
); // cors 에러 방지
app.use(morgan("dev")); // 로그 출력
app.use("/public", express.static("public")); // url을 통해 public 폴더의 파일들에 접근 가능하게 함
app.use(cookieParser()); // cookie 파싱

// 카카오 로그인 관련 API
app.post("/auth/kakao/login", getKakaoToken); // 카카오 토큰 요청 API
app.post("/auth/kakao/refresh", refreshKakaoAccessToken); // 카카오 액세스 토큰 재발급 API
app.post("/auth/kakao/logout", verifyKakaoAccessToken, logOutKakao); // 카카오 로그아웃 API
app.get("/auth/kakao/user", verifyKakaoAccessToken, getKakaoUserInfo); // 카카오 유저 정보 조회 API
app.delete("/auth/kakao/delete", verifyKakaoAccessToken, deleteUserAccount); // 카카오 유저 계정 삭제 API

// 리뷰 관련 API
app.get("/review", getFeed); // 리뷰 전체 조회 API
app.get("/review/:id", getReviewsById); // 특정 리뷰 조회 API
app.get("/review/:id/comments", getReviewCommentList); // 리뷰의 댓글 ID 목록 조회 API
app.post(
  "/review",
  verifyKakaoAccessToken,
  upload.array("images", 5),
  createReview
); // 리뷰 등록 API
app.patch(
  "/review/:id",
  verifyKakaoAccessToken,
  upload.array("images", 5),
  updateReview
); // 리뷰 수정 API
app.delete("/review/:id", verifyKakaoAccessToken, deleteReview); // 리뷰 삭제 API

// 유저 정보 관련 API
app.get("/user/:id", getUserInfoById); // 유저 정보 조회 API
app.get("/user/:id/comments", getUserComments); // 유저가 작성한 댓글 목록 조회 API
app.put(
  "/user/info",
  verifyKakaoAccessToken,
  upload.single("profileImage"),
  updateUserInfo
); // 유저 정보 수정 API

// 알림 관련 API
app.get("/notifications", verifyKakaoAccessToken, getNotifications); // 알림 조회 API
app.get("/notifications/stream", connectNotificationSSE); // 알림 SSE API
app.post(
  "/notifications/check",
  verifyKakaoAccessToken,
  updateNotificationCheckTime
); // 알림 확인 시간 업데이트 API
app.delete("/notifications/:id", verifyKakaoAccessToken, deleteNotification); // 알림 삭제 API

// 댓글 관련 API
app.get("/comment/:id", getCommentById); // 특정 댓글 조회 API
app.post("/comment/:id", verifyKakaoAccessToken, addComment); // 리뷰 댓글 등록 API
app.delete("/comment/:id", verifyKakaoAccessToken, deleteComment); // 리뷰 댓글 삭제 API

// 추천 관련 API
app.patch("/like/:id", verifyKakaoAccessToken, addLike); // 리뷰 추천 API
app.patch("/unlike/:id", verifyKakaoAccessToken, unLike); // 리뷰 추천 취소 API

app.listen(PORT, () => console.log(`${PORT} 서버 기동 중`));
