// gptService 단독 검증 스크립트
//
// 목적: 라우터 없이 runGptTryOn을 직접 호출해
//       GPT 이미지 가상 피팅 결과를 파일로 확인한다.
//
// 실행:
//   cd backend
//   node test-gpt.js
//
// 사전 조건:
//   - .env 에 OPENAI_API_KEY 가 있어야 한다.
//   - backend/sample-human.jpg 파일이 있어야 한다.

import "dotenv/config";
import { readFile, writeFile } from "fs/promises";
import { runGptTryOn } from "./src/services/gptService.js";

async function main() {
  // API 키 확인
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY 가 없습니다. backend/.env 를 확인하세요.");
    process.exit(1);
  }

  console.log("⏳ GPT 이미지 가상 피팅 호출 시작...");

  // 로컬 사람 사진을 Buffer로 읽는다.
  const humanImageBuffer = await readFile("./sample-human.jpg");

  // fal.ai 공식 샘플 옷 이미지를 재사용해 변수를 줄인다.
  const garmentImageUrl =
    "https://storage.googleapis.com/falserverless/model_tests/leffa/tshirt_image.jpg";

  const dataUri = await runGptTryOn({
    humanImageBuffer,
    humanImageName: "sample-human.jpg",
    humanImageMime: "image/jpeg",
    garmentImageUrl,
  });

  // 반환값 형식 검증
  if (!dataUri.startsWith("data:image/png;base64,")) {
    throw new Error(
      `예상과 다른 data URI 형식입니다. 앞 80자: ${dataUri.slice(0, 80)}`
    );
  }

  // data URI 전체를 콘솔에 출력하면 너무 길므로 앞 80자와 전체 길이만 출력한다.
  console.log("\n✅ 성공!");
  console.log("data URI 앞 80자:", dataUri.slice(0, 80));
  console.log("전체 문자열 길이:", dataUri.length);

  // base64 부분만 분리해 PNG 파일로 저장한다.
  const base64 = dataUri.replace("data:image/png;base64,", "");
  const imageBuffer = Buffer.from(base64, "base64");
  await writeFile("./gpt-result.png", imageBuffer);

  console.log("\n👉 결과 이미지가 ./gpt-result.png 로 저장됐습니다. 직접 열어 품질을 확인하세요.");
}

main().catch((error) => {
  // stack trace가 보이도록 error 객체 전체를 출력한다.
  console.error("\n❌ 실패:", error);
  process.exit(1);
});
