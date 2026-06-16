# ai-fitting-mall

AI 가상 피팅 쇼핑몰. 사용자가 자기 사진을 올리고 상품(옷)을 고르면,
가상 피팅 결과 이미지를 받아보는 앱.

이 프로젝트는 **"백엔드 + Flutter"** 아키텍처를 학습하기 위한 레퍼런스 과제다.
(사주앱 = Flutter 단독 / 이 앱 = 백엔드 분리형)

## 아키텍처 (런타임 흐름)

```
[Flutter 앱]           [백엔드 (Node/Express)]      [외부 API]
  사진 업로드  ──────►   이미지 저장 → URL
  옷 선택     ──────►   fal.ai 호출            ──────►  fal.ai
                        (API 키는 여기 보관)            (Kolors VTON v1.5)
                        결과 대기(폴링)         ◄──────  결과 이미지 URL
  결과 표시   ◄──────   결과 반환
```

**백엔드가 필요한 이유 (= 학습 포인트):**
1. fal.ai API 키를 클라이언트에 노출하지 않기 위해 (보안)
2. 업로드 이미지를 저장할 공간이 필요 (스토리지)
3. 외부 API 호출 중계 + 결과 대기 처리 (폴링)

## 폴더 구조

```
ai-fitting-mall/
├── frontend/          # Flutter 앱
├── backend/           # Node.js + Express 서버
│   └── src/
│       ├── routes/      # API 엔드포인트
│       ├── services/    # 비즈니스 로직 (fal.ai 호출 등)
│       └── middleware/  # 공통 처리 (에러 핸들링 등)
└── docs/              # 재현 가능 문서 (교수님 피드백 #5)
```

## 기술 스택

- **프론트:** Flutter / Dart
- **백엔드:** Node.js + Express
- **가상 피팅:** fal.ai - Kling Kolors Virtual Try-On v1.5 (@fal-ai/client)
- **버전 관리:** Git

## 스택 선택 근거 (교수님 피드백 #4 비교표 데이터)

| 후보 | 선택 | 이유 |
|------|------|------|
| Node.js + Express | ✅ | fal.ai JS SDK 1급 지원, 비동기 폴링이 언어 본성과 맞음, 사주앱과 스택 다양화 |
| Python + FastAPI | | 자동 문서화 강점이나 이 앱엔 Node가 더 적합 |

## 시작하기

- `backend/README.md` - 백엔드 실행법
- `frontend/README.md` - 앱 실행법 (Flutter 프로젝트 생성 후)

## MVP 범위

- [x] 워크스페이스 셋업
- [ ] 백엔드: 상품 목록 API
- [ ] 백엔드: 이미지 업로드 + fal.ai 피팅 중계
- [ ] 프론트: 상품 목록 → 상세 → 사진 업로드 → 결과 표시

## 로드맵 (비전, MVP 제외)

- 체형 입력 → 맞춤 모델 생성
- 3D 피팅 + 360도 회전
