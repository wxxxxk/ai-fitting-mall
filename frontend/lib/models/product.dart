// 상품 데이터 모델.
// 백엔드 GET /products, GET /products/:id 응답을 파싱한다.

class Product {
  final int id;
  final String name;
  final int price;
  final String garmentImageUrl;
  final String category;

  const Product({
    required this.id,
    required this.name,
    required this.price,
    required this.garmentImageUrl,
    required this.category,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      // 백엔드가 숫자를 num(int 또는 double)으로 내려보낼 수 있으므로 안전하게 변환한다.
      id: (json['id'] as num).toInt(),
      name: json['name'] as String,
      price: (json['price'] as num).toInt(),
      garmentImageUrl: json['garmentImageUrl'] as String,
      category: json['category'] as String,
    );
  }
}
