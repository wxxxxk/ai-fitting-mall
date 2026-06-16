// 공통 에러 핸들링 미들웨어.
//
// 라우터에서 next(err) 로 넘어온 에러를 한곳에서 처리한다.
// Express는 인자가 4개인 미들웨어를 "에러 핸들러"로 인식한다.

export function errorHandler(err, req, res, next) {
  console.error("[에러]", err.message);

  res.status(err.status || 500).json({
    error: err.message || "서버 내부 오류",
  });
}
