// 백엔드 API 통신 서비스.
// 외부 패키지(http)와 백엔드 엔드포인트 호출을 이 클래스에서 전담한다.
// 위젯은 이 클래스만 호출하고 HTTP 세부 사항을 알 필요가 없다.

import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;

import '../config/api_config.dart';
import '../models/product.dart';
import '../models/tryon_result.dart';

class ApiService {
  // ──────────────────────────────────────────────
  // 상품 API
  // ──────────────────────────────────────────────

  /// 전체 상품 목록을 가져온다.
  /// GET /products → { products: [...] }
  Future<List<Product>> fetchProducts() async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/products');
    final response = await http.get(uri);

    if (response.statusCode != 200) {
      throw Exception(
        'fetchProducts 실패 (HTTP ${response.statusCode}): ${response.body}',
      );
    }

    final Map<String, dynamic> json = jsonDecode(response.body);
    final dynamic raw = json['products'];

    if (raw is! List) {
      throw Exception(
        'fetchProducts: 응답에 products 배열이 없습니다. 실제 응답: ${response.body}',
      );
    }

    return raw
        .cast<Map<String, dynamic>>()
        .map(Product.fromJson)
        .toList();
  }

  /// 상품 단건을 가져온다.
  /// GET /products/:id → Product
  Future<Product> fetchProductById(int id) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/products/$id');
    final response = await http.get(uri);

    if (response.statusCode != 200) {
      throw Exception(
        'fetchProductById($id) 실패 (HTTP ${response.statusCode}): ${response.body}',
      );
    }

    try {
      final Map<String, dynamic> json = jsonDecode(response.body);
      return Product.fromJson(json);
    } catch (e) {
      throw Exception('fetchProductById($id) 파싱 실패: $e');
    }
  }

  // ──────────────────────────────────────────────
  // 가상 피팅 API
  // ──────────────────────────────────────────────

  /// 사용자 사진과 옷 이미지 URL로 가상 피팅을 요청한다.
  /// POST /tryon (multipart/form-data)
  /// → { fal: { status, imageUrl }, gpt: { status, imageUrl } }
  Future<TryOnResult> requestTryOn({
    required File humanImage,
    required String garmentImageUrl,
  }) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/tryon');

    // multipart/form-data 요청을 만든다.
    final request = http.MultipartRequest('POST', uri);

    // 파일 필드: 백엔드 multer 설정의 필드명 'humanImage 와 일치해야 한다.
    request.files.add(
      await http.MultipartFile.fromPath('humanImage', humanImage.path),
    );

    // 텍스트 필드: 옷 이미지 URL.
    request.fields['garmentImageUrl'] = garmentImageUrl;

    // 요청을 보내고 스트림 응답을 일반 Response로 변환한다.
    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode != 200) {
      throw Exception(
        'requestTryOn 실패 (HTTP ${response.statusCode}): ${response.body}',
      );
    }

    try {
      final Map<String, dynamic> json = jsonDecode(response.body);
      return TryOnResult.fromJson(json);
    } catch (e) {
      throw Exception('requestTryOn 응답 파싱 실패: $e — 원본: ${response.body}');
    }
  }
}
