// 앱 진입점.
// MaterialApp에 AppTheme.lightTheme를 주입해 전체 디자인 시스템을 적용한다.

import 'package:flutter/material.dart';
import 'theme/app_theme.dart';

void main() {
  runApp(const AiFittingMallApp());
}

class AiFittingMallApp extends StatelessWidget {
  const AiFittingMallApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AI Fitting Mall',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const ThemeDemo(),
    );
  }
}

/// 테마 확인용 임시 데모 화면.
/// 실제 화면 구현 시 이 클래스를 교체하거나 별도 파일로 이동한다.
class ThemeDemo extends StatelessWidget {
  const ThemeDemo({super.key});

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Scaffold(
      // 배경은 AppColors.background(흰색)가 자동 적용된다.
      appBar: AppBar(
        title: const Text('AI Fitting Mall'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.md),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 제목 텍스트
            Text('디자인 시스템 데모', style: textTheme.headlineLarge),
            const SizedBox(height: AppSpacing.xs),

            // 본문 텍스트
            Text(
              '미니멀 화이트 패션 커머스 컨셉의 테마가 적용된 화면입니다.',
              style: textTheme.bodyMedium,
            ),
            const SizedBox(height: AppSpacing.xs),

            // 보조 텍스트
            Text(
              'Pretendard 폰트 · Material 3 · AppTheme 토큰 적용',
              style: textTheme.bodySmall,
            ),
            const SizedBox(height: AppSpacing.lg),

            // 포인트 검정 버튼
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {},
                child: const Text('가상 피팅 시작하기'),
              ),
            ),
            const SizedBox(height: AppSpacing.lg),

            // 오프화이트 카드
            Card(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('상품 카드 예시', style: textTheme.headlineSmall),
                    const SizedBox(height: AppSpacing.xs),
                    Text('린넨 오버핏 셔츠', style: textTheme.bodyMedium),
                    const SizedBox(height: AppSpacing.xs),
                    Text('59,000원', style: textTheme.bodySmall),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
