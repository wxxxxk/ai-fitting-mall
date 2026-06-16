// fal.ai 호출 서비스.
//
// 이 파일이 외부 API(fal.ai) 호출을 전담한다.
// **API 키(FAL_KEY)는 이 레이어에서만 환경변수로 사용한다.**
// 라우터는 키의 존재를 모르고 이 함수만 호출한다. (관심사 분리)
//
// fal.ai 모델: fal-ai/kling/v1-5/kolors-virtual-try-on
// 입력: human_image_url, garment_image_url
// 출력: 피팅 결과 이미지 URL

import { fal } from "@fal-ai/client";

// fal 클라이언트는 환경변수 FAL_KEY 를 자동으로 읽는다.
// 별도 설정이 필요하면 여기서: fal.config({ credentials: process.env.FAL_KEY });

/**
 * fal.ai Kolors VTON 호출해 피팅 결과를 반환한다.
 *
 * TODO (Claude Code가 구현):
 *   - fal.subscribe("fal-ai/kling/v1-5/kolors-virtual-try-on", {...}) 호출
 *   - 비동기 큐 방식이므로 진행상태(onQueueUpdate) 처리
 *   - 결과에서 이미지 URL 추출해 반환
 *   - 실패(리스크 필터 등) 시 에러 처리
 *
 * @param {{ humanImageUrl: string, garmentImageUrl: string }} params
 * @returns {Promise<object>} 결과(이미지 URL 등)
 */
export async function runTryOn({ humanImageUrl, garmentImageUrl }) {
  if (!process.env.FAL_KEY) {
    throw new Error("FAL_KEY가 설정되지 않았습니다. backend/.env 를 확인하세요.");
  }

  // 골격: 실제 호출은 개발하며 채운다.
  // 참고 (fal.ai 문서 기준 입력 형태):
  //   const result = await fal.subscribe("fal-ai/kling/v1-5/kolors-virtual-try-on", {
  //     input: { human_image_url: humanImageUrl, garment_image_url: garmentImageUrl },
  //     logs: true,
  //   });
  //   return result.data;

  throw new Error("fal.ai 연동 미구현 - 개발 단계에서 작성 예정");
}
