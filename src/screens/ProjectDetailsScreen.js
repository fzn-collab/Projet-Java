import { ScrollView, StyleSheet, Text, View } from "react-native";

import ScreenHeader from "../components/ScreenHeader";
import { colors, components, layout, spacing, typography } from "../theme";

export default function ProjectDetailsScreen({ route, navigation }) {
  const project = route.params?.project;

  if (!project) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Aucun projet sélectionné</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Project"
        subtitle={project.titre}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>{project.titre}</Text>

          <Text style={styles.meta}>Secteur : {project.secteur}</Text>
          <Text style={styles.meta}>Besoin : {project.besoin}</Text>

          {project.description ? (
            <Text style={styles.description}>{project.description}</Text>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: layout.screen,
  center: layout.center,
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
  },
  content: {
    padding: spacing.xl,
    paddingTop: spacing.md,
  },
  card: {
    ...components.card,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.brandBlue,
    marginBottom: spacing.lg,
  },
  meta: {
    fontSize: typography.sizes.md,
    color: colors.textBody,
    marginBottom: spacing.sm + 2,
  },
  description: {
    fontSize: typography.sizes.md,
    lineHeight: 24,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
});
