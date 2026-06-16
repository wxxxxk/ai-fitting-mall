// uploadHumanImage 단독 검증 스크립트 (spike)
//
// 목적: falService.js의 uploadHumanImage가 실제로 동작하는지 확인.
//       특히 "multer Buffer → File 변환 → fal.storage.upload" 가
//       fal에서 진짜 먹히는지를 라우터 없이 미리 검증한다.
//
// 실행:
//   cd backend
//   node test-upload.js
//
// 주의: .env 에 FAL_KEY 가 있어야 함.

import "dotenv/config";
import fs from "node:fs";
import { uploadHumanImage } from "./src/services/falService.js";

async function main() {
  if (!process.env.FAL_KEY) {
    console.error("❌ FAL_KEY가 없습니다. backend/.env 를 확인하세요.");
    process.exit(1);
  }

  // multer가 주는 파일 객체를 흉내낸다.
  // 실제 사진 파일이 있으면 그 경로를 쓰고, 없으면 작은 더미 이미지를 만든다.
  // (라우터에서 multer가 채워주는 buffer/originalname/mimetype 형태를 모방)
  let buffer;
  const testImagePath = "./test-image.jpg"; // 직접 사진 하나 넣어두면 그걸 씀

  if (fs.existsSync(testImagePath)) {
    buffer = fs.readFileSync(testImagePath);
    console.log("📷 test-image.jpg 사용");
  } else {
    // 더미 바이트 (실제 이미지 아님 - 업로드 자체가 되는지만 확인용)
    buffer = Buffer.from("dummy image bytes for upload test");
    console.log("⚠️  test-image.jpg 없음 → 더미 버퍼로 업로드 경로만 테스트");
  }

  // multer memoryStorage 가 주는 file 객체 모양
  const fakeMulterFile = {
    buffer,
    originalname: "test-image.jpg",
    mimetype: "image/jpeg",
  };

  try {
    console.log("⏳ uploadHumanImage 호출...");
    const url = await uploadHumanImage(fakeMulterFile);
    console.log("\n✅ 업로드 성공! URL:");
    console.log(url);
    console.log("\n👉 이 URL이 나오면 Buffer→File 변환이 fal에서 정상 동작하는 것.");
  } catch (err) {
    console.error("\n❌ 업로드 실패:", err.message);
    console.error("전체 에러:", err);
    console.error(
      "\n힌트: 'File is not defined' 류면 Node 버전 확인 / Blob 대안으로 교체."
    );
  }
}

main();
