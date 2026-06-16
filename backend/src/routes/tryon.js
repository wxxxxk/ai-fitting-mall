// 가상 피팅 API 엔드포인트.
//
// 핵심 흐름:
//   1. 사용자 사진(human) + 옷 이미지(garment) URL을 받는다
//   2. services/falService 를 통해 fal.ai(Kolors VTON)를 호출한다
//      → API 키는 service 안에서만 사용 (라우터는 키를 모른다)
//   3. 결과 이미지 URL을 반환한다
//
// NOTE: fal.ai 실제 호출 로직은 개발하며 탐색 예정. 지금은 골격 + TODO.

import { Router } from "express";
import { runTryOn } from "../services/falService.js";

const router = Router();

// POST /tryon
// body: { humanImageUrl, garmentImageUrl }
router.post("/", async (req, res, next) => {
  try {
    const { humanImageUrl, garmentImageUrl } = req.body;

    // 입력 검증
    if (!humanImageUrl || !garmentImageUrl) {
      return res.status(400).json({
        error: "humanImageUrl 과 garmentImageUrl 이 모두 필요합니다",
      });
    }

    // 서비스 레이어에 위임 (fal.ai 호출)
    const result = await runTryOn({ humanImageUrl, garmentImageUrl });
    res.json(result);
  } catch (err) {
    // 에러 핸들링 미들웨어로 전달
    next(err);
  }
});

export default router;
