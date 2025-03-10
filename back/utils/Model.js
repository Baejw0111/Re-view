// MongoDB 연결 설정 및 스키마 정의
import mongoose from "mongoose"; // MongoDB와 연결

const { MONGO_URI } = process.env;

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(MONGO_URI);
    console.log("MongoDB에 연결되었습니다.");

    cachedConnection = connection;
    return cachedConnection;
  } catch (err) {
    console.error("MongoDB 연결 에러:", err);
    throw err; // 에러를 상위로 전파
  }
};

const db = mongoose.connection.useDb("mainDB");

/**
 * 소셜 아이디 맵 모델
 * @type {mongoose.Model}
 * @property {string[]} originalSocialId - 소셜 로그인 제공자 이름 + 원본 소셜 아이디 로 이뤄진 문자열 배열
 * @property {string} aliasId - 서비스 내에서 사용하기 위해 생성된 아이디
 */
export const IdMapModel = db.model(
  "IdMap",
  new mongoose.Schema({
    originalSocialId: { type: [String], default: [] },
    aliasId: { type: String, default: "" },
  }).index({ originalSocialId: 1, aliasId: 1 })
);

/**
 * 약관 동의 모델
 * @type {mongoose.Model}
 * @property {string} userId - 유저 ID
 * @property {number} termVersion - 이용 약관 버전
 * @property {Date} termAgreementTime - 이용 약관 동의 시점
 * @property {number} privacyVersion - 개인정보 수집 및 이용 약관 버전
 * @property {Date} privacyAgreementTime - 개인정보 수집 및 이용 약관 동의 시점
 */
export const AgreementModel = db.model(
  "Agreement",
  new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    termVersion: { type: Number, default: 0 },
    termAgreementTime: { type: Date, default: Date.now },
    privacyVersion: { type: Number, default: 0 },
    privacyAgreementTime: { type: Date, default: Date.now },
  })
);

/**
 * 유저 모델
 * @type {mongoose.Model}
 * @property {string} aliasId - 서비스 내에서 사용되는 유저의 별칭 아이디
 * @property {string} nickname - 닉네임
 * @property {string} profileImage - 프로필 이미지 경로
 * @property {Date} notificationCheckTime - 알림 확인 시간
 * @property {number} reviewCount - 작성한 리뷰 수
 * @property {number} totalRating - 총 평점
 */
export const UserModel = db.model(
  "User",
  new mongoose.Schema({
    aliasId: { type: String, default: "", index: true },
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
 * @property {string} aliasId - 서비스 내에서 사용되는 리뷰의 별칭 아이디
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
    aliasId: { type: String, default: "" },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
  }).index({ uploadTime: -1, likesCount: 1, authorId: 1, aliasId: 1 })
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
    },
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      default: "",
      ref: "Review",
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
    },
    koreanInitials: { type: String, default: "" },
    lastInteractedAt: { type: Date, default: Date.now },
    preference: { type: Number, default: 0 },
  }).index({ userId: 1, tagName: 1, preference: -1, lastInteractedAt: -1 })
);

/**
 * 댓글 모델
 * @type {mongoose.Model}
 * @property {string} aliasId - 서비스 내에서 사용되는 댓글의 별칭 아이디
 * @property {mongoose.Schema.Types.ObjectId} authorId - 작성자 DB ID
 * @property {Date} uploadTime - 업로드 시간
 * @property {mongoose.Schema.Types.ObjectId} reviewId - 댓글이 작성된 리뷰의 ID
 * @property {string} content - 댓글 내용
 */
export const CommentModel = db.model(
  "Comment",
  new mongoose.Schema({
    aliasId: { type: String, default: "" },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    uploadTime: { type: Date, default: Date.now },
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      default: "",
      ref: "Review",
    },
    content: { type: String, default: "" },
  }).index({ uploadTime: -1, authorId: 1, aliasId: 1 })
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
    },
    time: { type: Date, default: Date.now },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      default: "",
      ref: "Comment",
    },
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      default: "",
      ref: "Review",
    },
    category: { type: String, default: "" },
  }).index({ userId: 1, time: -1 })
);

export { connectDB };
