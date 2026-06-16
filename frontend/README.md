# 프론트엔드 (Flutter)

이 폴더는 Flutter 앱이 들어갈 자리다.
Flutter 프로젝트 생성은 맥에서 직접 한다.

## Flutter 프로젝트 생성

```bash
# ai-fitting-mall 루트에서
cd frontend
flutter create . --project-name ai_fitting_mall --org com.cvrlab

# 또는 frontend 폴더를 비우고 상위에서:
# flutter create frontend --project-name ai_fitting_mall --org com.cvrlab
```

## 백엔드 연결

- 백엔드 기본 주소: `http://127.0.0.1:8000`
- iOS 시뮬레이터: `http://127.0.0.1:8000` 그대로 사용 가능
- Android 에뮬레이터: `http://10.0.2.2:8000` (에뮬레이터에서 호스트 PC를 가리키는 특수 주소)

## 구현 예정 (MVP)

- [ ] 상품 목록 화면 (GET /products)
- [ ] 상품 상세 화면
- [ ] 내 사진 업로드
- [ ] 가상 피팅 요청 + 결과 표시 (POST /tryon)
