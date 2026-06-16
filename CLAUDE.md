# CLAUDE.md — 프로젝트 작업 규칙

이 문서는 Antigravity 터미널에서 작업하는 Claude Code / Codex가
이 프로젝트를 다룰 때 따라야 하는 규칙이다.

## 프로젝트 정체성

- **이름:** ai-fitting-mall
- **목적:** AI 가상 피팅 쇼핑몰. 백엔드 + Flutter 아키텍처 학습용 레퍼런스.
- **핵심 흐름:** Flutter 앱 → Express 백엔드 → fal.ai(Kolors VTON) → 결과 반환
- **백엔드:** Node.js + Express
- **프론트:** Flutter

## 절대 규칙 (보안)

1. **API 키를 클라이언트(Flutter)에 절대 넣지 않는다.**
   fal.ai 키(FAL_KEY)는 백엔드의 `.env`에만 둔다.
2. `.env` 파일은 절대 커밋하지 않는다. (.gitignore에 등록됨)
3. 키/시크릿을 코드에 하드코딩하지 않는다.

## 코드 스타일

- 주석은 **한국어**로 단다. (학습 목적이므로 "왜 이렇게 하는지" 설명 위주)
- 함수/변수명은 영어, 명확하고 서술적으로.
- 백엔드: ES Modules(import/export) 사용. async/await 일관 사용.
- 한 번에 거대한 변경 금지. 작은 단위로 나눠서 작업하고 설명한다.

## 작업 방식

- 새 기능은 먼저 "무엇을, 왜" 한 줄 설명 후 코드 작성.
- 파일 수정 전 기존 구조 존중 (폴더 구조 임의 변경 금지).
- 의존성 추가 시 package.json에 반드시 반영하고 이유를 남긴다.
- 커밋 메시지는 한국어로 명확하게. (예: "상품 목록 API 추가")

## 폴더 구조 (변경 금지)

```
backend/src/
  routes/      # API 엔드포인트만
  services/    # 비즈니스 로직 (fal.ai 호출 등)
  middleware/  # 공통 처리 (에러 핸들링 등)
frontend/      # Flutter 앱
docs/          # 재현 문서
```

## MVP 범위 밖 (지금 만들지 말 것)

- 체형 입력 → 맞춤 모델 생성
- 3D 피팅 / 360도 회전
- 결제 시스템
이것들은 로드맵 비전이며 MVP에 포함하지 않는다.
