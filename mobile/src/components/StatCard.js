import { Text, View } from "react-native";

import { colors, components, spacing, typography } from "../theme";

export default function StatCard({ label, value, hint }) {
  return (
    <View style={[components.card, { flex: 1, minWidth: "45%" }]}>
      <Text
        style={{
          fontSize: typography.sizes.display,
          fontWeight: typography.weights.bold,
          color: colors.accentBlue,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          marginTop: spacing.xs,
          fontSize: typography.sizes.sm,
          fontWeight: typography.weights.semibold,
          color: colors.textPrimary,
        }}
      >
        {label}
      </Text>
      {hint ? (
        <Text
          style={{
            marginTop: spacing.xs,
            fontSize: typography.sizes.xs,
            color: colors.textMuted,
          }}
        >
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
