// 가상 피팅 결과 모델.
// 백엔드 POST /tryon 응답 { fal: {...}, gpt: {...} } 을 파싱한다.

/// fal 또는 gpt 단일 결과.
class SingleResult {
  final String status;

  /// 성공 시 이미지 URL (fal은 https://, gpt는 data:image/png;base64,...).
  final String? imageUrl;

  /// 실패 시 에러 메시지.
  final String? message;

  const SingleResult({
    required this.status,
    this.imageUrl,
    this.message,
  });

  factory SingleResult.fromJson(Map<String, dynamic> json) {
    return SingleResult(
      status: json['status'] as String,
      imageUrl: json['imageUrl'] as String?,
      message: json['message'] as String?,
    );
  }

  /// 성공 여부.
  bool get isSuccess => status == 'success';

  /// GPT 결과처럼 data URI 형식인지 확인한다.
  /// data:image/png;base64,... 로 시작하면 `Image.memory` 로 표시할 수 있다.
  bool get isDataUri => imageUrl != null && imageUrl!.startsWith('data:');
}

/// fal + gpt 두 결과를 묶은 전체 피팅 결과.
class TryOnResult {
  final SingleResult fal;
  final SingleResult gpt;

  const TryOnResult({required this.fal, required this.gpt});

  factory TryOnResult.fromJson(Map<String, dynamic> json) {
    return TryOnResult(
      fal: SingleResult.fromJson(json['fal'] as Map<String, dynamic>),
      gpt: SingleResult.fromJson(json['gpt'] as Map<String, dynamic>),
    );
  }
}
