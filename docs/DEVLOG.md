# 개발 작업 로그

> 교수님 피드백 #5(노베이스 재현 가능 문서) 대비.
> "왜 이렇게 했는지"와 "막힌 지점 + 해결"을 그때그때 남긴다.
> 끝나고 정리하면 까먹어서 재현 불가하므로, 작업하며 실시간 기록.

## 의사결정 기록

### 백엔드 스택: Node.js + Express 선택
- 이유:
  1. fal.ai의 JS SDK(@fal-ai/client)가 가장 잘 지원됨 (공식 예제가 JS).
  2. 이미지 생성 API의 "요청→큐→폴링" 비동기 처리가 Node의 본성과 맞음.
  3. 사주앱(Flutter 단독)과 스택을 일부러 다르게 → 피드백 #4 비교표가
     실제 경험 기반으로 풍부해짐.
- 대안: Python + FastAPI (자동 문서화 강점이나 이 앱엔 Node가 더 적합).

### 구조: 모노레포 (frontend + backend 한 저장소)
- 이유: 학습 초기엔 한곳에서 보는 게 덜 헷갈림.
  "저장소 하나 클론하면 끝"이라 재현 문서화에 깔끔.

### 가상 피팅: fal.ai - Kolors VTON v1.5
- HF Space 데모는 공개 API 중단됨 → 중계 플랫폼 fal.ai 사용.
- API 키(FAL_KEY)는 백엔드 .env 에만 보관, 클라이언트 노출 금지.
- 키 보관/외부 호출은 services/falService.js 한곳에 격리.

## 막힌 지점 + 해결

(여기에 개발하며 만난 문제와 해결법을 기록)

## 다음 할 일

- [ ] 맥에서 워크스페이스 셋업 + git init + GitHub 연결
- [ ] backend: npm install 후 서버 실행 확인 (/products 뜨는지)
- [ ] Flutter 프로젝트 생성 (frontend/)
- [ ] fal.ai 계정 + 키 발급, falService.js 실제 호출 구현
- [ ] 이미지 업로드 엔드포인트 (multer)

## 작업 결과
## 2026.06.16

백엔드 MVP 완성. 전체 흐름 curl 검증 성공:
curl -X POST localhost:8000/tryon -F "humanImage=@사진.jpg" -F "garmentImageUrl=옷URL"
→ {"resultImageUrl":"..."} 반환. 
교훈: garment URL은 실제 접근 가능한 이미지여야 함(example.com 안 됨).


