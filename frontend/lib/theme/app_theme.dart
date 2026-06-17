// 디자인 시스템 토큰과 앱 테마를 한 곳에서 관리한다.
// 색상, 간격, 모서리 반경은 이 파일의 상수를 참조해야 한다.
// 직접 하드코딩하지 않는다.

import 'package:flutter/material.dart';

/// 색상 토큰 — 미니멀 화이트 패션 커머스 컨셉
abstract final class AppColors {
  /// 앱 전체 배경
  static const Color background = Color(0xFFFFFFFF);

  /// 카드/서피스 배경 (오프화이트)
  static const Color surface = Color(0xFFF7F7F5);

  /// 구분선, 테두리
  static const Color border = Color(0xFFEAEAEA);

  /// 주 텍스트 (거의 검정)
  static const Color primaryText = Color(0xFF1A1A1A);

  /// 보조 텍스트 (회색)
  static const Color secondaryText = Color(0xFF8A8A8A);

  /// 포인트 컬러 / 버튼 배경 (검정)
  static const Color accent = Color(0xFF1A1A1A);
}

/// 간격 토큰 — 8pt 그리드 기반
abstract final class AppSpacing {
  static const double xs = 4;
  static const double sm = 8;
  static const double md = 16;
  static const double lg = 24;
  static const double xl = 32;
}

/// 모서리 반경 토큰
abstract final class AppRadius {
  /// 카드 모서리 반경
  static const double card = 12;
}

/// 텍스트 스타일 토큰
abstract final class AppTextStyles {
  // 제목 스타일은 letterSpacing: -0.3 으로 통일한다.
  // 한국어 타이포그래피에서 자간을 살짝 좁히면 더 세련되게 보인다.

  static const TextStyle heading1 = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.w700,
    letterSpacing: -0.3,
    color: AppColors.primaryText,
  );

  static const TextStyle heading2 = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.w700,
    letterSpacing: -0.3,
    color: AppColors.primaryText,
  );

  static const TextStyle heading3 = TextStyle(
    fontSize: 17,
    fontWeight: FontWeight.w500,
    letterSpacing: -0.3,
    color: AppColors.primaryText,
  );

  static const TextStyle body = TextStyle(
    fontSize: 15,
    fontWeight: FontWeight.w400,
    color: AppColors.primaryText,
  );

  static const TextStyle caption = TextStyle(
    fontSize: 13,
    fontWeight: FontWeight.w400,
    color: AppColors.secondaryText,
  );
}

/// 앱 테마
abstract final class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,

      // 폰트 패밀리 — pubspec.yaml 에 등록된 Pretendard를 사용한다.
      fontFamily: 'Pretendard',

      scaffoldBackgroundColor: AppColors.background,

      // 흰 배경 중심의 ColorScheme
      colorScheme: const ColorScheme.light(
        surface: AppColors.surface,
        primary: AppColors.accent,
        onPrimary: Colors.white,
        onSurface: AppColors.primaryText,
        outline: AppColors.border,
      ),

      // 텍스트 테마 — 토큰과 매핑
      textTheme: const TextTheme(
        headlineLarge: AppTextStyles.heading1,
        headlineMedium: AppTextStyles.heading2,
        headlineSmall: AppTextStyles.heading3,
        bodyMedium: AppTextStyles.body,
        bodySmall: AppTextStyles.caption,
      ),

      // AppBar: 흰 배경, 그림자 없음, 검정 텍스트
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.background,
        foregroundColor: AppColors.primaryText,
        elevation: 0,
        scrolledUnderElevation: 0,
        titleTextStyle: TextStyle(
          fontFamily: 'Pretendard',
          fontSize: 17,
          fontWeight: FontWeight.w700,
          letterSpacing: -0.3,
          color: AppColors.primaryText,
        ),
      ),

      // ElevatedButton: 검정 배경, 흰 텍스트, 그림자 없음
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.accent,
          foregroundColor: Colors.white,
          elevation: 0,
          textStyle: const TextStyle(
            fontFamily: 'Pretendard',
            fontSize: 15,
            fontWeight: FontWeight.w500,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadius.card),
          ),
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.lg,
            vertical: AppSpacing.sm + 4, // 12
          ),
        ),
      ),

      // Card: 오프화이트 배경, 모서리 12, 그림자 없음, 테두리로 구분
      cardTheme: CardThemeData(
        color: AppColors.surface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.card),
          side: const BorderSide(color: AppColors.border),
        ),
        margin: EdgeInsets.zero,
      ),
    );
  }
}
