/**
 * Connecto design system — charte graphique extraite du mockup UI/UX.
 * Réutiliser ces tokens sur tous les écrans pour un style cohérent.
 */

export const colors = {
  primaryNavy: "#051D40",
  primaryNavyLight: "#0A2D5C",
  accentBlue: "#0066FF",
  accentBlueLight: "#3385FF",
  accentBluePale: "#E8F1FF",

  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceMuted: "#F1F5F9",

  textPrimary: "#051D40",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",
  textInverse: "#FFFFFF",

  border: "#E2E8F0",
  borderFocus: "#0066FF",

  success: "#22C55E",
  successBg: "#DCFCE7",
  error: "#EF4444",
  errorBg: "#FEE2E2",
  warning: "#F59E0B",
  warningBg: "#FEF3C7",

  gradientStart: "#051D40",
  gradientEnd: "#0066FF",

  skillTagBg: "#E8F1FF",
  skillTagText: "#0066FF",
};

export const typography = {
  fontFamily: "System",
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
    display: 34,
    hero: 42,
  },
  weights: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

export const shadows = {
  card: {
    shadowColor: "#051D40",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  button: {
    shadowColor: "#0066FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
};

export const components = {
  buttonPrimary: {
    backgroundColor: colors.accentBlue,
    borderRadius: radius.pill,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.button,
  },
  buttonPrimaryText: {
    color: colors.textInverse,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSecondaryText: {
    color: colors.accentBlue,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    ...shadows.card,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  badgeMatch: {
    backgroundColor: colors.successBg,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeMatchText: {
    color: colors.success,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  badgeSkill: {
    backgroundColor: colors.skillTagBg,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeSkillText: {
    color: colors.skillTagText,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  badgeStatusActive: {
    backgroundColor: colors.successBg,
    color: colors.success,
  },
  badgeStatusSuspended: {
    backgroundColor: colors.errorBg,
    color: colors.error,
  },
};

export default {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  components,
};
