// 상품 관련 API 엔드포인트.
//
// MVP 단계에서는 더미 데이터를 반환한다.
// 나중에 DB 연동으로 교체할 예정.

import { Router } from "express";

const router = Router();

// MVP용 더미 상품 데이터.
// garmentImageUrl: fal.ai / GPT 피팅에 넘길 "옷 이미지" URL.
// 안정적인 시연을 위해 접근이 검증된 fal.ai 공식 샘플 이미지 URL을 재사용한다.
const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: "화이트 코튼 티셔츠",
    price: 19000,
    garmentImageUrl:
      "https://storage.googleapis.com/falserverless/model_tests/leffa/tshirt_image.jpg",
    category: "upper_body",
  },
  {
    id: 2,
    name: "블랙 후드티",
    price: 39000,
    garmentImageUrl:
      "https://storage.googleapis.com/falserverless/model_tests/leffa/tshirt_image.jpg",
    category: "upper_body",
  },
  {
    id: 3,
    name: "베이직 맨투맨",
    price: 32000,
    garmentImageUrl:
      "https://storage.googleapis.com/falserverless/model_tests/leffa/tshirt_image.jpg",
    category: "upper_body",
  },
  {
    id: 4,
    name: "스트라이프 긴팔 셔츠",
    price: 45000,
    garmentImageUrl:
      "https://storage.googleapis.com/falserverless/model_tests/leffa/tshirt_image.jpg",
    category: "upper_body",
  },
  {
    id: 5,
    name: "린넨 오버핏 셔츠",
    price: 55000,
    garmentImageUrl:
      "https://storage.googleapis.com/falserverless/model_tests/leffa/tshirt_image.jpg",
    category: "upper_body",
  },
  {
    id: 6,
    name: "크루넥 니트 스웨터",
    price: 62000,
    garmentImageUrl:
      "https://storage.googleapis.com/falserverless/model_tests/leffa/tshirt_image.jpg",
    category: "upper_body",
  },
];

// GET /products → 전체 상품 목록
router.get("/", (req, res) => {
  res.json({ products: DUMMY_PRODUCTS });
});

// GET /products/:id → 상품 상세
router.get("/:id", (req, res) => {
  const productId = Number(req.params.id);
  const product = DUMMY_PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    return res.status(404).json({ error: "상품을 찾을 수 없습니다", productId });
  }
  res.json(product);
});

export default router;
