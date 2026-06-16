// Express 서버 진입점.
//
// 실행:
//   cd backend && npm install && npm run dev
// 확인:
//   http://127.0.0.1:8000/         → 헬스 체크

import express from "express";
import cors from "cors";
import "dotenv/config"; // .env 자동 로드

import productsRouter from "./routes/products.js";
import tryonRouter from "./routes/tryon.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 8000;

// JSON 본문 파싱
app.use(express.json());

// CORS: Flutter 앱(다른 출처)에서 호출 허용.
// 개발 단계에선 전체 허용, 배포 시 실제 도메인으로 좁힌다.
app.use(cors());

// 헬스 체크
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "ai-fitting-mall" });
});

// 기능별 라우터 등록
app.use("/products", productsRouter);
app.use("/tryon", tryonRouter);

// 에러 핸들링 미들웨어 (라우터 다음에 위치해야 함)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://127.0.0.1:${PORT}`);
});
