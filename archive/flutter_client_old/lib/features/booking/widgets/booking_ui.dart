import 'package:flutter/material.dart';

import '../../../core/theme.dart';

class BookingHeader extends StatelessWidget {
  const BookingHeader({
    super.key,
    required this.title,
    required this.subtitle,
  });

  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title,
              style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                    fontSize: 30,
                    letterSpacing: -1.1,
                  )),
          const SizedBox(height: 6),
          Text(subtitle,
              style: const TextStyle(
                color: OrbitTheme.textSecondary,
                height: 1.4,
              )),
        ],
      );
}

class ProgressStepper extends StatelessWidget {
  const ProgressStepper({super.key, required this.currentStep});

  final int currentStep;
  static const _labels = ['Details', 'Schedule', 'Confirm'];

  @override
  Widget build(BuildContext context) => Row(
        children: List.generate(_labels.length, (index) {
          final complete = index < currentStep;
          final active = index == currentStep;
          return Expanded(
            child: Column(
              children: [
                Row(
                  children: [
                    AnimatedContainer(
                      duration: const Duration(milliseconds: 320),
                      curve: Curves.easeOutCubic,
                      height: 34,
                      width: 34,
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: complete || active
                            ? OrbitTheme.clientGradient
                            : null,
                        color: complete || active
                            ? null
                            : OrbitTheme.elevatedSurface,
                        border: Border.all(
                          color: complete || active
                              ? Colors.transparent
                              : OrbitTheme.border,
                        ),
                        boxShadow: active
                            ? [
                                BoxShadow(
                                  color: OrbitTheme.clientCyan
                                      .withValues(alpha: 0.25),
                                  blurRadius: 16,
                                ),
                              ]
                            : null,
                      ),
                      child: complete
                          ? const Icon(Icons.check, size: 18)
                          : Text('${index + 1}',
                              style: const TextStyle(
                                  fontWeight: FontWeight.w900)),
                    ),
                    if (index < _labels.length - 1)
                      Expanded(
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 320),
                          curve: Curves.easeOutCubic,
                          height: 2,
                          margin: const EdgeInsets.symmetric(horizontal: 7),
                          decoration: BoxDecoration(
                            gradient: complete
                                ? OrbitTheme.clientGradient
                                : const LinearGradient(
                                    colors: [
                                      OrbitTheme.border,
                                      OrbitTheme.border,
                                    ],
                                  ),
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  _labels[index],
                  style: TextStyle(
                    color: active || complete
                        ? OrbitTheme.clientCyan
                        : OrbitTheme.textMuted,
                    fontSize: 10,
                    fontWeight: active ? FontWeight.w800 : FontWeight.w600,
                  ),
                ),
              ],
            ),
          );
        }),
      );
}

class BookingCard extends StatelessWidget {
  const BookingCard({super.key, required this.child, this.padding});

  final Widget child;
  final EdgeInsets? padding;

  @override
  Widget build(BuildContext context) => Container(
        padding: padding ?? const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: OrbitTheme.cardBackground,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: OrbitTheme.border),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.28),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: child,
      );
}

class GradientButton extends StatelessWidget {
  const GradientButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon = Icons.arrow_forward,
  });

  final String label;
  final VoidCallback? onPressed;
  final IconData icon;

  @override
  Widget build(BuildContext context) => DecoratedBox(
        decoration: BoxDecoration(
          gradient: OrbitTheme.clientGradient,
          borderRadius: BorderRadius.circular(18),
          boxShadow: [
            BoxShadow(
              color: OrbitTheme.clientPurple.withValues(alpha: 0.22),
              blurRadius: 16,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: SizedBox(
          height: 56,
          width: double.infinity,
          child: TextButton.icon(
            onPressed: onPressed,
            icon: Text(label,
                style: const TextStyle(
                    color: Colors.white, fontWeight: FontWeight.w900)),
            label: Icon(icon, color: Colors.white, size: 19),
          ),
        ),
      );
}

class BottomActionBar extends StatelessWidget {
  const BottomActionBar({
    super.key,
    this.secondaryLabel,
    this.onSecondaryPressed,
    required this.primaryLabel,
    required this.onPrimaryPressed,
  });

  final String? secondaryLabel;
  final VoidCallback? onSecondaryPressed;
  final String primaryLabel;
  final VoidCallback? onPrimaryPressed;

  @override
  Widget build(BuildContext context) => SafeArea(
        top: false,
        child: Container(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 18),
          decoration: const BoxDecoration(
            color: OrbitTheme.background,
            border: Border(top: BorderSide(color: OrbitTheme.border)),
          ),
          child: Row(
            children: [
              if (secondaryLabel != null) ...[
                OutlinedButton(
                  onPressed: onSecondaryPressed,
                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size(96, 56),
                    side: const BorderSide(color: OrbitTheme.border),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(18),
                    ),
                  ),
                  child: Text(secondaryLabel!),
                ),
                const SizedBox(width: 12),
              ],
              Expanded(
                child: GradientButton(
                  label: primaryLabel,
                  onPressed: onPrimaryPressed,
                  icon: primaryLabel == 'Complete Payment'
                      ? Icons.lock_outline
                      : Icons.arrow_forward,
                ),
              ),
            ],
          ),
        ),
      );
}
