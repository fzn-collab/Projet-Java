import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors, components, radius, spacing, typography } from "../theme";

export default function ProjectCard({ project, onPress }) {
  return (
    <TouchableOpacity onPress={() => onPress(project)} style={styles.card}>
      <View style={styles.imageBox}>
        <Text style={styles.imageIcon}>📁</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{project.titre}</Text>
        <Text style={styles.sub}>{project.secteur}</Text>
        <Text style={styles.info}>Besoin : {project.besoin}</Text>

        <View style={styles.badges}>
          {project.tags?.slice(0, 3).map((tag, i) => (
            <Text key={i} style={styles.badge}>
              {tag}
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
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
  },
  imageBox: {
    width: 70,
    height: 70,
    borderRadius: radius.lg - 2,
    backgroundColor: colors.brandBluePale,
    justifyContent: "center",
    alignItems: "center",
  },
  imageIcon: { fontSize: 30 },
  title: {
    fontSize: typography.sizes.lg - 1,
    fontWeight: typography.weights.bold,
    color: colors.brandBlue,
  },
  sub: {
    color: colors.textSubtle,
    fontSize: typography.sizes.xs,
  },
  info: {
    color: colors.textBody,
    fontSize: typography.sizes.xs,
    marginTop: 5,
  },
  badges: {
    flexDirection: "row",
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
});
