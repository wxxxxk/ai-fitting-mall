// 백엔드 API 연결 설정.
// 서버 주소가 바뀌면 이 파일 한 곳만 수정한다.

abstract final class ApiConfig {
  // iOS 시뮬레이터와 macOS에서는 127.0.0.1 이 로컬 서버를 가리킨다.
  // Android 에뮬레이터에서는 localhost 대신 http://10.0.2.2:8000을 사용해야 한다.
  // (에뮬레이터 안에서 localhost는 에뮬레이터 자신을 가리키기 때문)
  static const String baseUrl = 'http://127.0.0.1:8000';
}
