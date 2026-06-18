// 상품 상세 화면.
// 상품 이미지·이름·가격을 크게 보여주고,
// 갤러리에서 사용자 사진을 선택해 가상 피팅을 요청한다.

import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import '../models/product.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';
import 'result_screen.dart';

class ProductDetailScreen extends StatefulWidget {
  final Product product;

  const ProductDetailScreen({super.key, required this.product});

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  final _picker = ImagePicker();
  final _api = ApiService();

  XFile? _selectedImage;
  bool _isLoading = false;

  /// 갤러리에서 사진 1장을 선택한다.
  Future<void> _pickImage() async {
    final xFile = await _picker.pickImage(
      source: ImageSource.gallery,
      maxWidth: 1024,
      maxHeight: 1024,
    );
    if (xFile != null) {
      setState(() => _selectedImage = xFile);
    }
  }

  /// fal + GPT 가상 피팅 요청을 백엔드로 보낸다.
  Future<void> _startTryOn() async {
    if (_selectedImage == null) return;

    setState(() => _isLoading = true);

    try {
      final result = await _api.requestTryOn(
        humanImage: File(_selectedImage!.path),
        garmentImageUrl: widget.product.garmentImageUrl,
      );

      if (!mounted) return;

      Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => ResultScreen(result: result)),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('피팅 요청 실패: $e'),
          backgroundColor: AppColors.primaryText,
        ),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  /// 3자리마다 쉼표를 추가해 원 단위로 표시한다. 예: 59,000원
  String _formatPrice(int price) {
    return '${price.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (m) => '${m[1]},')}원';
  }

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Stack(
      children: [
        Scaffold(
          appBar: AppBar(title: Text(widget.product.name)),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpacing.md),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 옷 이미지 (크게)
                ClipRRect(
                  borderRadius: BorderRadius.circular(AppRadius.card),
                  child: Image.network(
                    widget.product.garmentImageUrl,
                    width: double.infinity,
                    height: 300,
                    fit: BoxFit.cover,
                    errorBuilder: (_, _, _) => Container(
                      height: 300,
                      color: AppColors.surface,
                      child: const Center(
                        child: Icon(Icons.image_not_supported, color: AppColors.secondaryText),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: AppSpacing.md),

                // 상품명
                Text(widget.product.name, style: textTheme.headlineMedium),
                const SizedBox(height: AppSpacing.xs),

                // 가격
                Text(_formatPrice(widget.product.price), style: AppTextStyles.caption),
                const SizedBox(height: AppSpacing.lg),

                const Divider(color: AppColors.border),
                const SizedBox(height: AppSpacing.lg),

                Text('내 사진으로 피팅해보기', style: textTheme.headlineSmall),
                const SizedBox(height: AppSpacing.md),

                // 선택된 사진 미리보기 / 플레이스홀더 — 탭해도 사진 선택 가능
                GestureDetector(
                  onTap: _pickImage,
                  child: Container(
                    width: double.infinity,
                    height: 220,
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(AppRadius.card),
                      border: Border.all(color: AppColors.border),
                    ),
                    clipBehavior: Clip.antiAlias,
                    child: _selectedImage != null
                        ? Image.file(File(_selectedImage!.path), fit: BoxFit.cover)
                        : Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.person_add_alt_1, size: 44, color: AppColors.secondaryText),
                              const SizedBox(height: AppSpacing.sm),
                              Text('탭해서 사진 선택', style: AppTextStyles.caption),
                            ],
                          ),
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),

                // 사진 선택 버튼
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: _pickImage,
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.primaryText,
                      side: const BorderSide(color: AppColors.border),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(AppRadius.card),
                      ),
                    ),
                    child: const Text('내 사진 선택'),
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),

                // 가상 피팅 버튼: 사진 선택 전에는 비활성화
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _selectedImage != null ? _startTryOn : null,
                    child: const Text('가상 피팅 하기'),
                  ),
                ),
                const SizedBox(height: AppSpacing.xl),
              ],
            ),
          ),
        ),

        // 로딩 오버레이: requestTryOn 진행 중에만 표시한다.
        if (_isLoading) const _LoadingOverlay(),
      ],
    );
  }
}

/// 전체 화면을 반투명으로 덮는 로딩 오버레이.
class _LoadingOverlay extends StatelessWidget {
  const _LoadingOverlay();

  @override
  Widget build(BuildContext context) {
    return ColoredBox(
      color: AppColors.background.withValues(alpha: 0.88),
      child: const Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CircularProgressIndicator(color: AppColors.accent),
            SizedBox(height: AppSpacing.md),
            Text('AI가 피팅 중입니다...', style: AppTextStyles.body),
          ],
        ),
      ),
    );
  }
}
