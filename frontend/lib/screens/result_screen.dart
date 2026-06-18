// 가상 피팅 결과 화면.
// 선택된 모델(fal.ai 또는 GPT)의 단일 결과를 표시한다.
// fal → Image.network / GPT → base64 디코드 후 Image.memory

import 'dart:convert';

import 'package:flutter/material.dart';

import '../models/tryon_result.dart';
import '../theme/app_theme.dart';

class ResultScreen extends StatelessWidget {
  final TryOnResult result;

  const ResultScreen({super.key, required this.result});

  /// 모델 키("fal", "gpt")를 사용자에게 보여줄 라벨로 변환한다.
  String get _modelLabel {
    if (result.model == 'fal') return 'fal.ai';
    if (result.model == 'gpt') return 'GPT';
    return result.model;
  }

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Scaffold(
      appBar: AppBar(title: const Text('피팅 결과')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.md),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 사용된 모델 라벨
            Text(_modelLabel, style: textTheme.headlineMedium),
            const SizedBox(height: AppSpacing.md),

            // 결과 이미지 또는 에러 메시지
            _buildResultImage(result.result),
            const SizedBox(height: AppSpacing.xl),

            // 목록으로 돌아가기
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  // 첫 화면(상품 목록)까지 스택을 모두 비운다.
                  Navigator.popUntil(context, (route) => route.isFirst);
                },
                child: const Text('다시 하기'),
              ),
            ),
            const SizedBox(height: AppSpacing.lg),
          ],
        ),
      ),
    );
  }

  /// SingleResult를 받아 상태에 맞는 위젯을 반환한다.
  Widget _buildResultImage(SingleResult singleResult) {
    // 실패 케이스
    if (!singleResult.isSuccess) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(AppRadius.card),
          border: Border.all(color: AppColors.border),
        ),
        child: Text(
          singleResult.message ?? '알 수 없는 오류가 발생했습니다.',
          style: AppTextStyles.caption,
        ),
      );
    }

    if (singleResult.isDataUri) {
      // GPT 응답: data:image/png;base64,{base64} 형식.
      // 콤마 뒤의 base64 부분만 분리해 디코드한다.
      final b64 = singleResult.imageUrl!.split(',').last;
      final bytes = base64Decode(b64);
      return ClipRRect(
        borderRadius: BorderRadius.circular(AppRadius.card),
        child: Image.memory(
          bytes,
          width: double.infinity,
          fit: BoxFit.cover,
          errorBuilder: (_, _, _) => _errorBox('이미지 디코딩 실패'),
        ),
      );
    }

    // fal.ai 응답: 일반 https:// URL
    return ClipRRect(
      borderRadius: BorderRadius.circular(AppRadius.card),
      child: Image.network(
        singleResult.imageUrl!,
        width: double.infinity,
        fit: BoxFit.cover,
        errorBuilder: (_, _, _) => _errorBox('이미지 로드 실패'),
      ),
    );
  }

  Widget _errorBox(String message) {
    return Container(
      width: double.infinity,
      height: 200,
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.card),
        border: Border.all(color: AppColors.border),
      ),
      child: Center(child: Text(message, style: AppTextStyles.caption)),
    );
  }
}
