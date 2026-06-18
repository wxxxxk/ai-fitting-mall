// 가상 피팅 결과 화면.
// fal.ai 결과와 GPT 결과를 위아래로 표시한다.
// fal → Image.network / GPT → base64 디코드 후 Image.memory

import 'dart:convert';

import 'package:flutter/material.dart';

import '../models/tryon_result.dart';
import '../theme/app_theme.dart';

class ResultScreen extends StatelessWidget {
  final TryOnResult result;

  const ResultScreen({super.key, required this.result});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('피팅 결과')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.md),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _ResultSection(label: 'fal.ai', singleResult: result.fal),
            const SizedBox(height: AppSpacing.lg),
            _ResultSection(label: 'GPT', singleResult: result.gpt),
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
}

/// 단일 API 결과 영역 (fal 또는 GPT).
class _ResultSection extends StatelessWidget {
  final String label;
  final SingleResult singleResult;

  const _ResultSection({required this.label, required this.singleResult});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: AppTextStyles.heading3),
        const SizedBox(height: AppSpacing.sm),
        _buildImage(),
      ],
    );
  }

  Widget _buildImage() {
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
