# ai-fitting-mall 프로젝트 컨텍스트 (GPTs Knowledge)

이 문서는 GPTs가 ai-fitting-mall 프로젝트를 이해하고
Claude Code / Codex용 실행 프롬프트를 생성하기 위한 참조 자료다.

> 최종 업데이트: fal.ai 연동 검증 완료 + 업로드 방식(방법 A) 확정 반영본

---

## 1. 프로젝트 개요

- **이름:** ai-fitting-mall
- **무엇:** AI 가상 피팅 쇼핑몰. 사용자가 자기 사진을 올리고 상품(옷)을 고르면,
  가상 피팅 결과 이미지를 받아보는 앱.
- **왜 만드나:** "백엔드 + Flutter" 아키텍처를 학습하기 위한 레퍼런스 과제.
  (사주앱 = Flutter 단독 / 이 앱 = 백엔드 분리형 → 두 방식을 비교 학습)
- **전략:** 방법 A로 빠르게 MVP → 랩미팅 시연 → 반응 좋으면 스토리지 연결(방법 B).

## 2. 기술 스택

- **프론트:** Flutter / Dart
- **백엔드:** Node.js + Express (ES Modules, async/await)
- **가상 피팅:** fal.ai - Kling Kolors Virtual Try-On v1.5 (@fal-ai/client)
- **버전 관리:** Git (GitHub 원격: wxxxxk/ai-fitting-mall)
- **개발 IDE:** Antigravity (터미널에서 Claude Code / Codex 실행)
- **개발 OS:** macOS

## 3. 아키텍처 (런타임 흐름) — 방법 A 확정

```
[Flutter 앱]              [백엔드 (Express)]                    [fal.ai]
 사진 파일 선택
   │ 파일 업로드(multipart) -> POST /tryon
   │                          (1) multer로 파일 받기
   │                          (2) fal.storage.upload(파일) -> 사람사진 URL
   │                          (3) 옷 이미지 URL은 상품 데이터에 있음
   │                          (4) fal.subscribe(VTON) -------> 피팅 실행
   │                          (5) 결과 image.url 추출        <-- 결과 URL
   │  결과 이미지 URL <-------  반환
 결과 표시
```

**방법 A 핵심:** fal SDK의 `fal.storage.upload()`가 "파일 -> URL" 변환을 대신해준다.
-> 내 스토리지(S3 등) 없이 사용자 사진을 fal에 넘길 수 있어 빠르게 구현 가능.
(방법 B = 내 스토리지 직접 운영은 시연 후 확장 단계)

**백엔드가 필요한 이유:**
1. fal.ai API 키를 클라이언트에 노출하지 않기 위해 (보안)
2. 업로드 이미지 중계 및 fal.storage 업로드 처리
3. 외부 API 호출 중계 + 결과 대기(폴링)

## 4. 폴더 구조

```
ai-fitting-mall/
├── README.md
├── CLAUDE.md          # Claude Code/Codex가 따를 규칙
├── .gitignore
├── backend/           # Node.js + Express
│   ├── package.json   # @fal-ai/client, express, cors, dotenv, multer
│   ├── .env.example   # FAL_KEY, PORT
│   ├── test-fal.js    # fal.ai 검증용 독립 스크립트 (이미 성공 확인됨)
│   └── src/
│       ├── server.js         # 진입점, 라우터/미들웨어 등록
│       ├── routes/
│       │   ├── products.js   # 상품 목록/상세 (더미 데이터) - 구현됨
│       │   └── tryon.js      # 가상 피팅 (POST /tryon) - 골격, multer 연결 필요
│       ├── services/
│       │   └── falService.js # fal.ai 호출 (API 키는 여기서만!) - 골격, 정식 구현 필요
│       └── middleware/
│           └── errorHandler.js
├── frontend/          # Flutter 앱 (아직 flutter create 전)
└── docs/
    └── DEVLOG.md      # 의사결정·작업 로그
```

## 5. 절대 규칙 (보안)

1. API 키(FAL_KEY)는 클라이언트(Flutter)에 절대 넣지 않는다. 백엔드 .env 에만.
2. .env 는 절대 커밋하지 않는다.
3. 키/시크릿을 코드에 하드코딩하지 않는다.

## 6. 코드 스타일

- 주석은 한국어 ("왜 이렇게 하는지" 설명 위주, 학습 목적).
- 함수/변수명은 영어, 명확하게.
- 백엔드: ES Modules(import/export), async/await 일관 사용.
- 한 번에 거대한 변경 금지. 작은 단위로.
- 의존성 추가 시 package.json 반영 + 이유 기록.
- 커밋 메시지는 한국어.

## 7. 현재 구현 상태

완료:
- 서버 골격 + CORS + 에러 핸들링
- 상품 목록/상세 API (더미 데이터)
- git 초기화 + GitHub push
- **fal.ai 연동 검증 완료** (test-fal.js로 실제 호출 성공, 품질 양호)

다음 작업 (방법 A 기준, 순서대로):
1. falService.js 정식 구현
   - test-fal.js의 fal.subscribe 호출 로직 이식
   - fal.storage.upload(파일) -> 사용자 사진 URL 변환 함수 추가
2. tryon.js 라우터 수정 - multer로 파일 받아 falService에 전달
3. server.js - multer 업로드 미들웨어 연결
4. Flutter 프로젝트 생성 및 화면 (상품목록->사진선택->결과표시)

## 8. MVP 범위 밖 (만들지 말 것)

- 체형 입력 -> 맞춤 모델 생성
- 3D 피팅 / 360도 회전
- 결제 시스템
- 내 스토리지(S3/R2) 직접 운영 <- 시연 후 확장 (지금은 방법 A)
(로드맵 비전이며 MVP 제외)

## 9. fal.ai 호출 참고 (검증된 실제 형태)

호출 (test-fal.js에서 검증 성공):
```javascript
import { fal } from "@fal-ai/client";
// FAL_KEY 환경변수 자동 인식

const result = await fal.subscribe("fal-ai/kling/v1-5/kolors-virtual-try-on", {
  input: {
    human_image_url: humanImageUrl,     // 사람 사진 URL
    garment_image_url: garmentImageUrl, // 옷 이미지 URL
  },
  logs: true,
  onQueueUpdate: (update) => { /* 진행상태 */ },
});
```

검증된 결과 구조 (이 경로로 URL 추출):
```javascript
result.data.image.url   // 피팅 결과 이미지 URL
// 예: { image: { url, content_type, file_name, file_size, width: null, height: null } }
```

방법 A 파일 업로드 (사용자 사진 -> URL):
```javascript
// fal SDK가 파일을 받아 임시 URL로 만들어준다
const url = await fal.storage.upload(file);
```

주의사항:
- 비동기 큐 방식이라 수 초~수십 초 걸림 (폴링 정상).
- width/height가 null로 올 수 있음 -> 프론트에서 크기 처리 유의.
- 상용 VTON은 콘텐츠 필터로 정상 요청도 막힐 수 있음 -> 실패 시 에러 처리/재시도.
