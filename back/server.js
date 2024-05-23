// "nodemon server.js"로 서버 가동
import express from "express"; // 서버 구축용 프레임워크
import cors from "cors"; // cors 관리
import morgan from "morgan"; // 로그 출력용
import mongoose from "mongoose"; // MongoDB와 연결
import "dotenv/config"; // .env 파일에서 바로 환경 변수 로드

const app = express(); // express 인스턴스 생성
const { PORT, MONGO_URI } = process.env; // 로드된 환경변수는 process.env로 접근 가능

// 미들웨어
app.use(express.json()); //json 데이터 파싱
app.use(express.urlencoded({ extended: true })); // form 데이터(x-www-form-urlencoded) 파싱(extended 옵션 정의 안해주면 에러 터짐)
app.use(cors()); // cors 에러 방지
app.use(morgan("dev"));

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB에 연결되었습니다."))
  .catch((err) => console.error("MongoDB 연결 에러:", err));
/*
참고로 이전에는 connect 함수 안에 여러 옵션들을 덕지덕지 달아놔야 했었지만
mongoose 6.0 버전 이상부터는 해당 옵션들이 기본값이 되어 따로 명시하지 않아도 된다.
*/

// MongoDB 데이터 삽입 테스트
const testConnection = async () => {
  try {
    const db = mongoose.connection.useDb("testDatabase"); // 'testDatabase'라는 이름의 DB 사용. 없으면 생성됨.

    /* 'Test' 모델 정의.
    Mongoose는 모델을 생성 시 모델 이름을 복수형으로 변환해 컬렉션 이름을 생성한다.
    따라서 'Test' 모델은 'tests' 컬렉션과 매핑된다.
    */
    const TestModel = db.model("Test", new mongoose.Schema({ name: String }));
    const testData = new TestModel({ name: "테스트 데이터" }); // 테스트 데이터 생성
    await testData.save(); // 데이터 저장
    console.log("테스트 데이터가 MongoDB에 삽입되었습니다.");
  } catch (error) {
    console.error("테스트 데이터 삽입 중 에러 발생:", error);
  }
};

const db = mongoose.connection.useDb("mainDB");

// 변경 시 FE의 interface.ts도 변경할 것
// 유저 모델
const UserModel = db.model(
  "User",
  new mongoose.Schema({
    name: { type: String, default: "사용자" },
    email: { type: String, default: "" },
    password: { type: String, default: "" },
  })
);
// 리뷰 모델
const ReviewModel = db.model(
  "Review",
  new mongoose.Schema({
    author: { type: String, default: "작성자" },
    uploadTime: { type: Date, default: Date.now },
    title: { type: String, default: "" },
    comments: { type: String, default: "" },
    ratings: { type: [Number], default: [0] },
    tags: { type: [String], default: [] },
  })
);
// 태그 모델
const TagModel = db.model(
  "Tag",
  new mongoose.Schema({
    tagName: { type: String, default: "" },
    appliedCount: { type: Number, default: 0 },
  })
);

// 리뷰 전체 조회 API
app.get("/review", async (req, res) => {
  try {
    const reviews = await ReviewModel.find();
    res.json(reviews);
  } catch (error) {
    console.error("리뷰 조회 중 에러 발생:", error);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
});

// 리뷰 등록 API
app.post("/review", async (req, res) => {
  const { author, uploadTime, title, comments, ratings, tags } = req.body;

  if (!author || !uploadTime || !title || !comments || !ratings || !tags) {
    return res.status(400).json({ message: "모든 필드를 채워주세요." });
  }

  try {
    const reviewData = new ReviewModel({
      author,
      uploadTime,
      title,
      comments,
      ratings,
      tags,
    });
    await reviewData.save(); // 데이터 저장
    res.status(201).json({ message: "리뷰가 성공적으로 등록되었습니다." });
  } catch (error) {
    console.error("리뷰 등록 중 에러 발생:", error);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
});

app.get("/", (req, res) => {
  return res.json({
    port: PORT,
    mongo_uri: MONGO_URI,
  });
});

app.listen(PORT, () => console.log(`${PORT} 서버 기동 중`));
