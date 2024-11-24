// MongoDB 연결 설정 및 스키마 정의
import mongoose from "mongoose"; // MongoDB와 연결

const { MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB에 연결되었습니다."))
  .catch((err) => console.error("MongoDB 연결 에러:", err));
/*
참고로 이전에는 connect 함수 안에 여러 옵션들을 덕지덕지 달아놔야 했었지만
mongoose 6.0 버전 이상부터는 해당 옵션들이 기본값이 되어 따로 명시하지 않아도 된다.
*/

const db = mongoose.connection.useDb("mainDB");

/**
 * 유저 모델
 * @type {mongoose.Model}
 * @property {number} kakaoId - 유저 카카오 ID
 * @property {string} nickname - 닉네임
 * @property {string} profileImage - 프로필 이미지 경로
 * @property {Date} notificationCheckTime - 알림 확인 시간
 * @property {number} reviewCount - 작성한 리뷰 수
 * @property {number} totalRating - 총 평점
 */
export const UserModel = db.model(
  "User",
  new mongoose.Schema({
    kakaoId: { type: Number, default: 0, index: true },
    nickname: { type: String, default: "" },
    profileImage: { type: String, default: "" },
    notificationCheckTime: { type: Date, default: Date.now },
    reviewCount: { type: Number, default: 0 },
    totalRating: { type: Number, default: 0 },
  })
);

/**
 * 리뷰 모델
 * @type {mongoose.Model}
 * @property {mongoose.Schema.Types.ObjectId} authorId - 작성자 DB ID
 * @property {Date} uploadTime - 업로드 시간
 * @property {string} title - 제목
 * @property {string[]} images - 이미지 파일 경로 모음
 * @property {string} reviewText - 리뷰 내용
 * @property {number} rating - 평점
 * @property {string[]} tags - 태그
 * @property {number} likesCount - 추천 수
 * @property {number} commentsCount - 댓글 수
 * @property {boolean} isSpoiler - 스포일러 여부
 */
export const ReviewModel = db.model(
  "Review",
  new mongoose.Schema({
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    uploadTime: { type: Date, default: Date.now },
    title: { type: String, default: "" },
    images: { type: [String], default: [] },
    reviewText: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    isSpoiler: { type: Boolean, default: false },
  }).index({ uploadTime: -1, likesCount: 1, authorId: 1 })
);

/**
 * 유저 추천 모델
 * @type {mongoose.Model}
 * @property {mongoose.Schema.Types.ObjectId} userId - 유저 DB ID
 * @property {mongoose.Schema.Types.ObjectId} reviewId - 추천된 리뷰 ID
 * @property {Date} likedAt - 추천 시간
 */
export const ReviewLikeModel = db.model(
  "ReviewLike",
  new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      default: "",
      index: true,
    },
    likedAt: { type: Date, default: Date.now },
  }).index({ userId: 1, likedAt: -1, reviewId: 1 })
);

/**
 * 태그 모델
 * @type {mongoose.Model}
 * @property {string} tagName - 태그 이름
 * @property {mongoose.Schema.Types.ObjectId} userId - 유저 DB ID
 * @property {string} koreanInitials - 태그 이름이 한글일 경우 초성 저장
 * @property {Date} lastInteractedAt - 마지막으로 태그와 상호작용한 시간
 * @property {number} preference - 유저의 태그에 대한 선호도
 */
export const TagModel = db.model(
  "Tag",
  new mongoose.Schema({
    tagName: { type: String, default: "" },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    koreanInitials: { type: String, default: "" },
    lastInteractedAt: { type: Date, default: Date.now },
    preference: { type: Number, default: 0 },
  }).index({ userId: 1, tagName: 1, preference: -1, lastInteractedAt: -1 })
);

/**
 * 댓글 모델
 * @type {mongoose.Model}
 * @property {mongoose.Schema.Types.ObjectId} authorId - 작성자 DB ID
 * @property {Date} uploadTime - 업로드 시간
 * @property {mongoose.Schema.Types.ObjectId} reviewId - 댓글이 작성된 리뷰의 ID
 * @property {string} content - 댓글 내용
 */
export const CommentModel = db.model(
  "Comment",
  new mongoose.Schema({
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    uploadTime: { type: Date, default: Date.now },
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      default: "",
      index: true,
    },
    content: { type: String, default: "" },
  })
);

/**
 * 알림 모델
 * @type {mongoose.Model}
 * @property {mongoose.Schema.Types.ObjectId} userId - 알림을 받을 유저의 DB ID
 * @property {Date} time - 알림 생성 시간
 * @property {mongoose.Schema.Types.ObjectId} commentId - 알림과 관련된 댓글 ID
 * @property {mongoose.Schema.Types.ObjectId} reviewId - 알림과 관련된 리뷰 ID
 * @property {string} category - 알림 종류
 * @property {boolean} isRead - 알림 읽음 여부
 */
export const NotificationModel = db.model(
  "Notification",
  new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    time: { type: Date, default: Date.now },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      default: "",
      index: true,
      ref: "Comment",
    },
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      default: "",
      index: true,
      ref: "Review",
    },
    category: { type: String, default: "" },
  }).index({ userId: 1, time: -1 })
);
