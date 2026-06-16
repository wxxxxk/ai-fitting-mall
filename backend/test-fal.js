// fal.ai Kolors VTON 최소 검증 스크립트 (spike)
//
// 목적: "fal.ai 가상 피팅이 실제로 되는가 / 품질이 쓸 만한가"만 확인.
//       앱 통합 전, 독립적으로 호출 한 번 해보는 용도.
//
// 실행:
//   cd backend
//   npm install            (아직 안 했으면)
//   node test-fal.js
//
// 주의:
//   - .env 에 FAL_KEY 가 들어있어야 함
//   - 첫 테스트는 fal 공식 샘플 이미지 URL 그대로 사용 (변수 줄이기)
//     → 내 사진은 검증 통과 후에

import { fal } from "@fal-ai/client";
import "dotenv/config";

// fal 클라이언트는 환경변수 FAL_KEY 를 자동 인식한다.
// 혹시 자동 인식이 안 되면 아래 주석을 풀어 명시적으로 설정:
// fal.config({ credentials: process.env.FAL_KEY });

async function main() {
  // 키 확인
  if (!process.env.FAL_KEY) {
    console.error("❌ FAL_KEY가 없습니다. backend/.env 를 확인하세요.");
    process.exit(1);
  }

  console.log("⏳ fal.ai Kolors VTON 호출 시작...");

  // fal 공식 문서의 샘플 이미지 URL (사람 + 옷)
  const input = {
    human_image_url:
      "https://storage.googleapis.com/falserverless/model_tests/leffa/person_image.jpg",
    garment_image_url:
      "https://storage.googleapis.com/falserverless/model_tests/leffa/tshirt_image.jpg",
  };

  try {
    const result = await fal.subscribe("fal-ai/kling/v1-5/kolors-virtual-try-on", {
      input,
      logs: true,
      // 진행 상태 출력 (큐 방식이라 시간이 걸림)
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("   ...처리 중");
        }
      },
    });

    console.log("\n✅ 성공! 결과:");
    console.log(JSON.stringify(result.data, null, 2));
    console.log("\n👉 결과 이미지 URL을 브라우저에 붙여넣어 품질을 직접 확인하세요.");
  } catch (err) {
    console.error("\n❌ 실패:", err.message);
    console.error("전체 에러:", err);
    console.error(
      "\n힌트: 인증 실패면 키 확인, '리스크 필터' 류면 이미지를 바꿔서 재시도."
    );
  }
}

main();
