// 가상 피팅 API 엔드포인트.
//
// 핵심 흐름:
//   1. humanImage 파일 + garmentImageUrl + model 을 multipart/form-data로 받는다
//   2. model 값에 따라 fal 또는 gpt 서비스 하나만 호출한다
//   3. 결과를 { model, result: { status, imageUrl } } 형태로 반환한다
//
// API 키는 각 서비스 파일 안에서만 사용한다. (라우터는 키를 모른다)

import { Router } from "express";
import multer from "multer";
import { uploadHumanImage, runVirtualTryOn } from "../services/falService.js";
import { runGptTryOn } from "../services/gptService.js";

// falService / gptService 둘 다 file.buffer를 사용하므로
// 디스크에 저장하지 않고 메모리에 담아 두는 memoryStorage를 사용한다.
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

// fal 체인: fal.storage 업로드 → Kolors VTON 호출.
// 비교 모드는 이 두 호출 함수를 Promise.allSettled로 병렬 실행하면 됨
async function runFal(file, garmentImageUrl) {
  const humanImageUrl = await uploadHumanImage(file);
  const imageUrl = await runVirtualTryOn({ humanImageUrl, garmentImageUrl });
  return { status: "success", imageUrl };
}

// GPT 이미지 편집 호출.
// 비교 모드는 이 두 호출 함수를 Promise.allSettled로 병렬 실행하면 됨
async function runGpt(file, garmentImageUrl) {
  const imageUrl = await runGptTryOn({
    humanImageBuffer: file.buffer,
    humanImageName: file.originalname,
    humanImageMime: file.mimetype,
    garmentImageUrl,
  });
  return { status: "success", imageUrl };
}

// POST /tryon
// Content-Type: multipart/form-data
// 필드:
//   humanImage      (파일)   - 사용자 사진
//   garmentImageUrl (텍스트) - 피팅할 옷 이미지 URL
//   model           (텍스트) - 사용할 모델: "fal" 또는 "gpt"
router.post("/", upload.single("humanImage"), async (req, res, next) => {
  try {
    // 입력 검증
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "humanImage 파일이 없습니다. 사용자 사진을 첨부하세요." });
    }

    const { garmentImageUrl, model } = req.body;

    if (!garmentImageUrl) {
      return res
        .status(400)
        .json({ error: "garmentImageUrl 이 없습니다. 옷 이미지 URL을 전달하세요." });
    }

    if (!model || (model !== "fal" && model !== "gpt")) {
      return res
        .status(400)
        .json({ error: 'model 값이 올바르지 않습니다. 허용값: "fal" 또는 "gpt"' });
    }

    // 선택된 모델 하나만 호출한다.
    let result;
    try {
      result = model === "fal"
        ? await runFal(req.file, garmentImageUrl)
        : await runGpt(req.file, garmentImageUrl);
    } catch (serviceErr) {
      // 서비스 호출 실패는 200으로 반환해 프론트가 에러 내용을 확인할 수 있도록 한다.
      result = {
        status: "error",
        message: serviceErr instanceof Error ? serviceErr.message : String(serviceErr),
      };
    }

    res.json({ model, result });
  } catch (err) {
    // 예상하지 못한 에러만 errorHandler로 전달한다.
    next(err);
  }
});

export default router;
