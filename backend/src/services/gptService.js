// OpenAI GPT 이미지 편집 API를 이용한 가상 피팅 서비스.
//
// fal.ai(Kolors VTON)와 별개로 gpt-image-2 모델을 사용해
// 비교 모드용 피팅 결과를 생성한다.
// API 키(OPENAI_API_KEY)는 환경변수에서만 읽는다.

import OpenAI, { toFile } from "openai";

// 클라이언트를 모듈 최상단에서 생성하면 환경변수 로드 전에 에러가 발생할 수 있다.
// 함수 호출 시점(서버 실행 후)에 생성해 dotenv가 먼저 로드되도록 한다.
function createClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY 가 설정되지 않았습니다. backend/.env 를 확인하세요."
    );
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 180000, // 이미지 생성은 시간이 오래 걸리므로 3분으로 설정
  });
}

/**
 * gpt-image-2 이미지 편집 API로 가상 피팅 결과를 생성한다.
 *
 * @param {{
 *   humanImageBuffer: Buffer,   // multer memoryStorage에서 받은 사람 이미지 버퍼
 *   humanImageName:   string,   // 원본 파일명 (확장자 포함)
 *   humanImageMime:   string,   // MIME 타입 (예: image/jpeg)
 *   garmentImageUrl:  string,   // 옷 이미지 퍼블릭 URL
 * }} params
 * @returns {Promise<string>} data:image/png;base64,... 형태의 data URI
 */
export async function runGptTryOn({
  humanImageBuffer,
  humanImageName,
  humanImageMime,
  garmentImageUrl,
}) {
  const client = createClient();

  // 필수값 검증
  if (!humanImageBuffer) {
    throw new Error(
      "humanImageBuffer 가 없습니다. multer memoryStorage 설정을 확인하세요."
    );
  }
  if (!garmentImageUrl) {
    throw new Error("garmentImageUrl 이 없습니다. 옷 이미지 URL을 전달하세요.");
  }

  // 옷 이미지 URL에서 바이너리를 내려받는다.
  const garmentResponse = await fetch(garmentImageUrl);
  if (!garmentResponse.ok) {
    throw new Error(
      `옷 이미지 다운로드 실패 (status: ${garmentResponse.status}) — URL을 확인하세요.`
    );
  }
  const garmentArrayBuffer = await garmentResponse.arrayBuffer();
  const garmentBuffer = Buffer.from(garmentArrayBuffer);

  // content-type 헤더에서 옷 이미지 MIME 타입을 읽는다.
  // 없으면 image/jpeg 를 기본값으로 사용한다.
  const garmentMime =
    garmentResponse.headers.get("content-type") ?? "image/jpeg";

  // multer Buffer / fetch Buffer → OpenAI SDK가 요구하는 File 객체로 변환한다.
  // OpenAI SDK의 toFile 헬퍼는 Node Buffer + 파일명 + MIME 타입을 받아
  // 멀티파트 업로드에 쓸 수 있는 File 객체를 만든다.
  const humanFile = await toFile(humanImageBuffer, humanImageName, {
    type: humanImageMime,
  });
  const garmentFile = await toFile(garmentBuffer, "garment", {
    type: garmentMime,
  });

  // gpt-image-2 이미지 편집 요청.
  // 프롬프트에서 image 1 = 사람, image 2 = 의상임을 명시한다.
  const result = await client.images.edit({
    model: "gpt-image-2",
    image: [humanFile, garmentFile],
    prompt:
      "You are given two images. " +
      "Image 1 is a photo of a person. " +
      "Image 2 is a clothing item. " +
      "Generate a realistic virtual try-on result where the person in image 1 is wearing the clothing from image 2. " +
      "Preserve the person's face, hair, pose, body shape, and background exactly as in image 1. " +
      "Accurately reflect the color, logo, pattern, and texture details of the garment from image 2.",
  });

  // GPT는 base64로 응답하므로 프론트에서 바로 표시할 수 있게 data URI로 변환한다.
  const b64 = result.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error(
      `GPT 응답에서 b64_json을 찾을 수 없습니다. 응답 구조: ${JSON.stringify(result.data)}`
    );
  }

  return `data:image/png;base64,${b64}`;
}
