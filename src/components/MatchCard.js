import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors, components, radius, spacing, typography } from "../theme";

export default function MatchCard({ match, onPress }) {
  return (
    <TouchableOpacity onPress={() => onPress(match)} style={styles.card}>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(match.name || match.nom || "?").charAt(0)}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{match.name || match.nom}</Text>
          <Text style={styles.sub}>Match score</Text>

          <View style={styles.badgeRow}>
            <Text style={styles.badge}>{match.score}% match</Text>
          </View>

          {match.reasons?.slice(0, 2).map((reason, index) => (
            <Text key={index} style={styles.reason}>
              ✓ {reason}
            </Text>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    ...components.card,
    marginBottom: spacing.md + 2,
  },
  row: { flexDirection: "row", gap: spacing.md },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.brandBluePale,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: colors.brandBlue,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  name: {
    fontSize: typography.sizes.lg - 1,
    fontWeight: typography.weights.bold,
    color: colors.brandBlue,
  },
  sub: {
    color: colors.textSubtle,
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  badgeRow: { flexDirection: "row", marginTop: 6 },
  badge: {
    ...components.badgeMatchText,
    backgroundColor: colors.successBg,
    color: colors.success,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  reason: {
    marginTop: 5,
    fontSize: typography.sizes.xs,
    color: colors.textBody,
  },
});
