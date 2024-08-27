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

// 변경 시 FE의 interface.ts도 변경할 것
/**
 * 유저 모델
 * @type {mongoose.Model}
 * @property {string} kakaoId - 카카오 ID
 * @property {string} reviews - 작성한 리뷰 ID 모음
 * @property {string} favoriteTags - 자주 찾는 태그 모음
 */
export const UserModel = db.model(
  "User",
  new mongoose.Schema({
    kakaoId: { type: String, default: "" },
    nickname: { type: String, default: "" },
    reviews: { type: [String], default: [] },
    favoriteTags: { type: [String], default: [] },
  })
);

/**
 * 리뷰 모델
 * @type {mongoose.Model}
 * @property {string} author - 작성자
 * @property {Date} uploadTime - 업로드 시간
 * @property {string} title - 제목
 * @property {string[]} images - 이미지 파일 경로 모음
 * @property {string} reviewText - 리뷰 내용
 * @property {number} rating - 평점
 * @property {string[]} tags - 태그
 * @property {number} likes - 좋아요 수
 * @property {number} comments - 댓글 수
 */
export const ReviewModel = db.model(
  "Review",
  new mongoose.Schema({
    author: { type: String, default: "작성자" },
    uploadTime: { type: Date, default: Date.now },
    title: { type: String, default: "" },
    images: { type: [String], default: [] },
    reviewText: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
  })
);

/**
 * 태그 모델
 * @type {mongoose.Model}
 * @property {string} tagName - 태그 이름
 * @property {number} appliedCount - 적용된 횟수
 */
export const TagModel = db.model(
  "Tag",
  new mongoose.Schema({
    tagName: { type: String, default: "" },
    appliedCount: { type: Number, default: 0 },
  })
);

/**
 * 댓글 모델
 * @type {mongoose.Model}
 * @property {string} authorId - 작성자 ID
 * @property {Date} uploadTime - 업로드 시간
 * @property {string} reviewId - 댓글이 작성된 리뷰의 ID
 * @property {string} content - 댓글 내용
 */
export const CommentModel = db.model(
  "Comment",
  new mongoose.Schema({
    authorId: { type: String, default: "" },
    uploadTime: { type: Date, default: Date.now },
    reviewId: { type: String, default: "" },
    content: { type: String, default: "" },
  })
);
