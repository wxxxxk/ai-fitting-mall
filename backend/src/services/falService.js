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
 * multer가 메모리에 받아 둔 사용자 사진을 fal.storage에 업로드하고 URL을 반환한다.
 *
 * [왜 Buffer를 File로 감싸는가]
 * fal.storage.upload()는 브라우저 환경을 기준으로 설계되어 File/Blob 타입을 받는다.
 * 반면 multer(Node.js)는 file.buffer(Node Buffer)를 제공하는데,
 * Node Buffer는 브라우저의 File과 타입이 달라 그대로 넘기면 fal이 거부한다.
 * Node 18+ 환경에는 전역 File과 Blob이 존재하므로 Node Buffer를 File로 감싸
 * fal이 기대하는 바이너리 객체 형태로 변환한다.
 *
 * @param {import('multer').File} file - multer memoryStorage 기준 파일 객체
 * @returns {Promise<string>} fal.storage에 업로드된 이미지 URL
 */
export async function uploadHumanImage(file) {
  if (!file || !file.buffer) {
    throw new Error(
      "파일 또는 file.buffer 가 없습니다. multer memoryStorage 설정을 확인하세요."
    );
  }

  // Node Buffer → 브라우저 호환 File 객체로 변환
  // fal.storage.upload는 File/Blob을 기대하므로 Node 전역 File로 감싼다.
  const fileObject = new File([file.buffer], file.originalname, {
    type: file.mimetype,
  });

  // Node 18 미만이거나 File이 전역에 없을 경우 아래 Blob 대안을 사용:
  // const fileObject = new Blob([file.buffer], { type: file.mimetype });

  const url = await fal.storage.upload(fileObject);
  return url;
}

/**
 * fal.ai Kolors VTON을 호출해 가상 피팅 결과 이미지 URL을 반환한다.
 *
 * @param {{ humanImageUrl: string, garmentImageUrl: string }} params
 * @returns {Promise<string>} 피팅 결과 이미지 URL
 */
export async function runVirtualTryOn({ humanImageUrl, garmentImageUrl }) {
  if (!process.env.FAL_KEY) {
    throw new Error("FAL_KEY가 설정되지 않았습니다. backend/.env 를 확인하세요.");
  }

  const result = await fal.subscribe("fal-ai/kling/v1-5/kolors-virtual-try-on", {
    input: {
      human_image_url: humanImageUrl,
      garment_image_url: garmentImageUrl,
    },
    logs: true,
    // 큐 방식이라 처리까지 시간이 걸린다. 진행 상태를 서버 로그로 남긴다.
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        console.log(`[fal] 처리 중... (status: ${update.status})`);
      }
    },
  });

  const imageUrl = result?.data?.image?.url;
  if (!imageUrl) {
    throw new Error(
      `fal 응답에서 이미지 URL을 찾을 수 없습니다. 응답 구조: ${JSON.stringify(result?.data)}`
    );
  }

  return imageUrl;
}

// tryon.js 라우터가 runTryOn 이름으로 import하므로 별칭 export를 유지한다.
// 내부 구현은 runVirtualTryOn으로 위임한다.
export async function runTryOn({ humanImageUrl, garmentImageUrl }) {
  const imageUrl = await runVirtualTryOn({ humanImageUrl, garmentImageUrl });
  return { imageUrl };
}
