// 가상 피팅 API 엔드포인트.
//
// 핵심 흐름:
//   1. humanImage 파일 + garmentImageUrl 텍스트를 multipart/form-data로 받는다
//   2. uploadHumanImage로 사용자 사진을 fal.storage에 올려 URL을 얻는다
//   3. runVirtualTryOn으로 fal.ai(Kolors VTON)를 호출한다
//   4. 결과 이미지 URL을 { resultImageUrl } 형태로 반환한다
//
// API 키는 falService 안에서만 사용한다. (라우터는 키를 모른다)

import { Router } from "express";
import multer from "multer";
import { uploadHumanImage, runVirtualTryOn } from "../services/falService.js";

// falService의 uploadHumanImage가 file.buffer를 사용하므로
// 디스크에 저장하지 않고 메모리에 담아 두는 memoryStorage를 사용한다.
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

// POST /tryon
// Content-Type: multipart/form-data
// 필드:
//   humanImage    (파일)  - 사용자 사진
//   garmentImageUrl (텍스트) - 피팅할 옷 이미지 URL
router.post("/", upload.single("humanImage"), async (req, res, next) => {
  try {
    // 파일 누락 검증
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "humanImage 파일이 없습니다. 사용자 사진을 첨부하세요." });
    }

    // 옷 이미지 URL 누락 검증
    const { garmentImageUrl } = req.body;
    if (!garmentImageUrl) {
      return res
        .status(400)
        .json({ error: "garmentImageUrl 이 없습니다. 옷 이미지 URL을 전달하세요." });
    }

    // 사용자 사진을 fal.storage에 업로드해 URL로 변환
    const humanImageUrl = await uploadHumanImage(req.file);

    // fal.ai Kolors VTON 호출
    const resultImageUrl = await runVirtualTryOn({ humanImageUrl, garmentImageUrl });

    res.json({ resultImageUrl });
  } catch (err) {
    // 에러 핸들링 미들웨어로 전달
    next(err);
  }
});

export default router;
