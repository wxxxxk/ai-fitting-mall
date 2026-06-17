// 가상 피팅 API 엔드포인트 — fal.ai / GPT 비교 모드.
//
// 핵심 흐름:
//   1. humanImage 파일 + garmentImageUrl 텍스트를 multipart/form-data로 받는다
//   2. fal 체인(업로드 → VTON)과 GPT 이미지 편집을 Promise.allSettled로 병렬 실행한다
//   3. 두 결과를 { fal: {...}, gpt: {...} } 형태로 반환한다
//      - 한쪽 실패 시 해당 필드에 { status: "error", message } 를 담는다
//      - 둘 다 실패하면 HTTP 500을 반환한다
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

// allSettled 결과의 rejected reason에서 메시지를 안전하게 꺼낸다.
function getErrorMessage(reason) {
  if (reason instanceof Error) return reason.message;
  return String(reason);
}

// POST /tryon
// Content-Type: multipart/form-data
// 필드:
//   humanImage      (파일)   - 사용자 사진
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

    // fal 체인: 업로드 → VTON 을 하나의 async 작업으로 묶는다.
    // 업로드가 먼저 완료돼야 VTON 호출이 가능하므로 내부는 순차다.
    const falTask = (async () => {
      const humanImageUrl = await uploadHumanImage(req.file);
      return runVirtualTryOn({ humanImageUrl, garmentImageUrl });
    })();

    // GPT 작업: multer buffer를 그대로 전달한다.
    const gptTask = runGptTryOn({
      humanImageBuffer: req.file.buffer,
      humanImageName: req.file.originalname,
      humanImageMime: req.file.mimetype,
      garmentImageUrl,
    });

    // 두 작업을 병렬 실행한다. 한쪽 실패가 다른 쪽 결과를 막지 않도록 allSettled를 사용한다.
    const [falResult, gptResult] = await Promise.allSettled([falTask, gptTask]);

    // allSettled 결과를 응답 형태로 변환한다.
    const fal =
      falResult.status === "fulfilled"
        ? { status: "success", imageUrl: falResult.value }
        : { status: "error", message: getErrorMessage(falResult.reason) };

    const gpt =
      gptResult.status === "fulfilled"
        ? { status: "success", imageUrl: gptResult.value }
        : { status: "error", message: getErrorMessage(gptResult.reason) };

    // 둘 다 실패한 경우에만 HTTP 500을 반환한다.
    const bothFailed = fal.status === "error" && gpt.status === "error";
    res.status(bothFailed ? 500 : 200).json({ fal, gpt });
  } catch (err) {
    // Promise.allSettled 외부에서 발생한 예기치 못한 에러는 errorHandler로 넘긴다.
    next(err);
  }
});

export default router;
