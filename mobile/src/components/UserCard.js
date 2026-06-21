import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors, components, radius, spacing, typography } from "../theme";

export default function UserCard({ user, onPress }) {
  return (
    <TouchableOpacity onPress={() => onPress(user)} style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user.nom?.charAt(0) || "U"}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{user.nom}</Text>
        <Text style={styles.sub}>{user.secteur}</Text>

        <View style={styles.badges}>
          {user.competences?.slice(0, 3).map((c, i) => (
            <Text key={i} style={styles.badge}>
              {c}
            </Text>
          ))}
        </View>

        <Text style={styles.info}>Besoin : {user.besoin}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    ...components.card,
    marginBottom: spacing.md + 2,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md + 2,
  },
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
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.xl,
  },
  name: {
    fontSize: typography.sizes.lg - 1,
    fontWeight: typography.weights.bold,
    color: colors.brandBlue,
  },
  sub: {
    color: colors.textSubtle,
    fontSize: typography.sizes.xs,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 7,
  },
  badge: {
    backgroundColor: colors.brandBluePale,
    color: colors.brandBlue,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm + 2,
    fontSize: typography.sizes.xs - 1,
    overflow: "hidden",
  },
  info: {
    marginTop: 7,
    color: colors.textBody,
    fontSize: typography.sizes.xs,
  },
});
