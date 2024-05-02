import express from "express"; // 서버 구축용 프레임워크
import cors from "cors"; // cors 관리
const PORT = 8080;

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  return res.json({
    msg: "제발 돼라ㅠㅠ",
  });
});

app.listen(PORT, () => console.log(`${PORT} 서버 기동 중`));
