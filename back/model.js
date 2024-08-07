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
 * @property {string} name - 사용자 이름
 * @property {string} email - 사용자 이메일
 * @property {string} password - 사용자 비밀번호
 */
export const UserModel = db.model(
  "User",
  new mongoose.Schema({
    name: { type: String, default: "사용자" },
    email: { type: String, default: "" },
    password: { type: String, default: "" },
  })
);

/**
 * 리뷰 모델
 * @type {mongoose.Model}
 * @property {string} author - 작성자
 * @property {Date} uploadTime - 업로드 시간
 * @property {string} title - 제목
 * @property {string} image - 이미지 경로
 * @property {string} reviewText - 리뷰 내용
 * @property {number} rating - 평점
 * @property {string[]} tags - 태그
 */
export const ReviewModel = db.model(
  "Review",
  new mongoose.Schema({
    author: { type: String, default: "작성자" },
    uploadTime: { type: Date, default: Date.now },
    title: { type: String, default: "" },
    image: { type: String, default: "" },
    reviewText: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
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
