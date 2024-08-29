import multer from "multer"; // 파일 업로드용
import path from "path"; // 파일 경로 설정용

// 파일 업로드 처리
export const upload = multer({
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