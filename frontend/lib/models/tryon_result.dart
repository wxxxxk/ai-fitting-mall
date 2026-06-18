// 가상 피팅 결과 모델.
// 백엔드 POST /tryon 응답 { model, result } 를 파싱한다.

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

/// 선택된 모델과 그 결과를 담는 전체 피팅 응답.
class TryOnResult {
  /// 호출된 모델 이름. "fal" 또는 "gpt".
  final String model;

  /// 해당 모델의 실행 결과.
  final SingleResult result;

  const TryOnResult({required this.model, required this.result});

  factory TryOnResult.fromJson(Map<String, dynamic> json) {
    return TryOnResult(
      model: json['model'] as String,
      result: SingleResult.fromJson(json['result'] as Map<String, dynamic>),
    );
  }
}
