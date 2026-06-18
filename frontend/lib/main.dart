// 앱 진입점.
// MaterialApp에 AppTheme.lightTheme를 주입해 전체 디자인 시스템을 적용한다.

import 'package:flutter/material.dart';

import 'screens/product_list_screen.dart';
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
      home: const ProductListScreen(),
    );
  }
}
