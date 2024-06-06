// "nodemon server.js"로 서버 가동
import express from "express"; // 서버 구축용 프레임워크
import cors from "cors"; // cors 관리
import morgan from "morgan"; // 로그 출력용
import multer from "multer"; // 파일 업로드 처리용
import mongoose from "mongoose"; // MongoDB와 연결
import path from "path"; // 파일 경로 처리용
import fs from "fs"; // 파일 삭제용
import "dotenv/config"; // .env 파일에서 바로 환경 변수 로드

const app = express(); // express 인스턴스 생성
const { PORT, MONGO_URI } = process.env; // 로드된 환경변수는 process.env로 접근 가능

// 미들웨어
app.use(express.json()); //json 데이터 파싱
app.use(express.urlencoded({ extended: true })); // form 데이터(x-www-form-urlencoded) 파싱(extended 옵션 정의 안해주면 에러 터짐)
app.use(cors()); // cors 에러 방지
app.use(morgan("dev")); // 로그 출력
app.use("/public", express.static("public")); // url을 통해 public 폴더의 파일들에 접근 가능하게 함

// 파일 업로드 처리
const upload = multer({
  storage: multer.diskStorage({
    // 파일 저장 위치 설정
    destination: function (req, file, cb) {
      cb(null, path.join("public"));
    },
    // 파일 이름 설정
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname); // 파일 확장자 추출
      const originalName = path.basename(file.originalname, ext); // 파일 이름 추출
      cb(null, path.join(originalName + Date.now() + ext)); // 파일 이름 설정
    },
  }),
});

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
    image: { type: String, default: "" },
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

// 특정 리뷰 조회 API
app.get("/review/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const reviewData = await ReviewModel.findById(id);
    if (!reviewData) {
      return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
    }
    res.json(reviewData);
  } catch (error) {
    console.error("리뷰 조회 중 에러 발생:", error);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
});

// 리뷰 등록 API
app.post("/review", async (req, res) => {
  // 리뷰 등록에 문제가 있을 시 이미지가 서버에 저장되는 것을 막기 위해 multer 미들웨어를 수동으로 처리
  const uploader = upload.single("image");

  uploader(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "파일 업로드 중 에러 발생", error: err });
    }

    // 필드 검증
    const { author, uploadTime, title, comments, ratings, tags } = req.body;
    if (
      !author ||
      !uploadTime ||
      !title ||
      !comments ||
      !ratings ||
      !tags ||
      !req.file
    ) {
      // 이미지 파일이 이미 업로드되었다면 삭제
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res
        .status(400)
        .json({ message: "모든 필드를 채워주세요.", req: req.body });
    }

    try {
      const reviewData = new ReviewModel({
        author,
        image: req.file.path,
        uploadTime,
        title,
        comments,
        ratings,
        tags,
      });
      await reviewData.save();
      res.status(201).json({ message: "리뷰가 성공적으로 등록되었습니다." });
    } catch (error) {
      console.error("리뷰 등록 중 에러 발생:", error);
      res.status(500).json({ message: "서버 에러가 발생했습니다." });
    }
  });
});

// 특정 리뷰 수정 API
app.patch("/review/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body; // 클라이언트로부터 받은 업데이트할 데이터
  const uploader = upload.single("image"); // 이미지 파일을 처리

  uploader(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "이미지 업로드 중 에러 발생", error: err });
    }

    try {
      const reviewData = await ReviewModel.findById(id);
      if (!reviewData) {
        return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
      }

      // 받은 필드만 업데이트
      for (let key in updateData) {
        reviewData[key] = updateData[key];
      }

      // 이미지 파일이 있을 경우 기존 이미지 파일 삭제 후 경로 업데이트
      if (req.file) {
        if (reviewData.image) {
          fs.unlinkSync(reviewData.image); // 기존 이미지 파일 삭제
        }
        reviewData.image = req.file.path; // 새 이미지 파일 경로로 업데이트
      }

      await reviewData.save(); // 수정된 데이터 저장
      res.status(200).json({ message: "리뷰가 성공적으로 수정되었습니다." });
    } catch (error) {
      console.error("리뷰 수정 중 에러 발생:", error);
      res.status(500).json({ message: "서버 에러가 발생했습니다." });
    }
  });
});

// 특정 리뷰 삭제 API
app.delete("/review/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const review = await ReviewModel.findById(id);
    if (!review) {
      return res.status(404).json({ message: "리뷰가 존재하지 않습니다." });
    }
    if (review.image) {
      fs.unlinkSync(review.image); // 이미지 파일 삭제
    }
    await ReviewModel.findByIdAndDelete(id);
    res.status(200).json({ message: "리뷰가 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("리뷰 삭제 중 에러 발생:", error);
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
