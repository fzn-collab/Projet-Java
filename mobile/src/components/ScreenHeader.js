import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, spacing, typography } from "../theme";

export default function ScreenHeader({
  title,
  subtitle,
  onBack,
  rightAction,
}) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={{
        paddingTop: insets.top + spacing.lg,
        paddingBottom: spacing.xxl,
        paddingHorizontal: spacing.xl,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {onBack ? (
          <TouchableOpacity onPress={onBack} hitSlop={12}>
            <Text style={{ color: colors.textInverse, fontSize: 28 }}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 28 }} />
        )}

        {rightAction || <View style={{ width: 28 }} />}
      </View>

      <Text
        style={{
          color: colors.textInverse,
          fontSize: typography.sizes.hero,
          fontWeight: typography.weights.bold,
          marginTop: spacing.md,
        }}
      >
        {title}
      </Text>

      {subtitle ? (
        <Text
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: typography.sizes.md,
            marginTop: spacing.xs,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </LinearGradient>
  );
}
