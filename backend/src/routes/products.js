// 상품 관련 API 엔드포인트.
//
// MVP 단계에서는 더미 데이터를 반환한다.
// 나중에 DB 연동으로 교체할 예정.

import { Router } from "express";

const router = Router();

// MVP용 더미 상품 데이터.
// garmentImageUrl: fal.ai 피팅에 넘길 "옷 이미지" URL.
const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: "화이트 코튼 티셔츠",
    price: 19000,
    garmentImageUrl: "https://example.com/tshirt_white.jpg",
    category: "upper_body",
  },
  {
    id: 2,
    name: "블랙 후드티",
    price: 39000,
    garmentImageUrl: "https://example.com/hoodie_black.jpg",
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
