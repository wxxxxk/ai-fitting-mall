# 백엔드 (Node.js + Express)

## 최초 1회 셋업

```bash
cd backend

# 의존성 설치
npm install

# 환경변수 파일 생성 후 FAL_KEY 채우기
cp .env.example .env
# 편집기로 .env 열어서 fal.ai 키 입력
```

## 서버 실행

```bash
cd backend
npm run dev      # 파일 변경 시 자동 재시작 (--watch)
# 또는
npm start        # 일반 실행
```

## 확인

- 헬스 체크: http://127.0.0.1:8000/
- 상품 목록: http://127.0.0.1:8000/products

## 현재 구현 상태

- [x] 서버 골격 + CORS + 에러 핸들링
- [x] 상품 목록/상세 API (더미 데이터)
- [ ] 이미지 업로드 엔드포인트 (multer)
- [ ] fal.ai 가상 피팅 연동 (services/falService.js)
- [ ] DB 연동 (지금은 더미)

## 구조 설명

```
src/
├── server.js          # 진입점, 라우터/미들웨어 등록
├── routes/            # API 엔드포인트
│   ├── products.js    # 상품 목록/상세
│   └── tryon.js       # 가상 피팅 요청
├── services/          # 외부 호출/비즈니스 로직
│   └── falService.js  # fal.ai 호출 (API 키는 여기서만!)
└── middleware/
    └── errorHandler.js
```

## 빠른 테스트 (서버 실행 후)

```bash
# 상품 목록
curl http://127.0.0.1:8000/products

# 가상 피팅 (아직 미구현이라 에러 응답 정상)
curl -X POST http://127.0.0.1:8000/tryon \
  -H "Content-Type: application/json" \
  -d '{"humanImageUrl":"https://example.com/me.jpg","garmentImageUrl":"https://example.com/shirt.jpg"}'
```
