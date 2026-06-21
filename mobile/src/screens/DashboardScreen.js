import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ScreenHeader from "../components/ScreenHeader";
import { auth } from "../services/authService";
import {
  colors,
  components,
  layout,
  radius,
  spacing,
  typography,
} from "../theme";

const API_URL = "http://10.130.182.153:8080";

export default function DashboardScreen({ navigation }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/dashboard/${userId}`);
      const data = await response.json();
      setDashboard(data);
    } catch (error) {
      console.log("Erreur dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.brandBlue} />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Dashboard"
        subtitle="Vue d'ensemble de votre activité"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{dashboard?.totalProjets || 0}</Text>
            <Text style={styles.statLabel}>Total Projets</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{dashboard?.projetsActifs || 0}</Text>
            <Text style={styles.statLabel}>Projets Actifs</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("MyProjects")}
        >
          <Text style={styles.buttonText}>Voir mes projets</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => navigation.navigate("ProjectForm", { project: null })}
        >
          <Text style={styles.buttonSecondaryText}>Créer un projet</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Projets récents</Text>
        {dashboard?.projetsRecents?.length === 0 && (
          <Text style={styles.empty}>Aucun projet pour l'instant</Text>
        )}
        {dashboard?.projetsRecents?.map((project) => (
          <View key={project.id} style={styles.projectCard}>
            <Text style={styles.projectTitle}>{project.titre}</Text>
            <Text style={styles.projectSecteur}>{project.secteur}</Text>
            <Text style={styles.projectBesoin}>Besoin : {project.besoin}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: layout.screen,
  center: layout.center,
  loadingText: {
    marginTop: spacing.sm + 2,
    color: colors.textSecondary,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.md,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  statCard: {
    ...components.card,
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  statNumber: {
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.bold,
    color: colors.brandBlue,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  button: {
    ...components.buttonPrimary,
    borderRadius: radius.lg - 2,
    marginBottom: spacing.sm + 2,
  },
  buttonSecondary: {
    ...components.buttonSecondary,
    borderRadius: radius.lg - 2,
    marginBottom: spacing.sm + 2,
  },
  buttonText: components.buttonPrimaryText,
  buttonSecondaryText: components.buttonSecondaryText,
  sectionTitle: {
    ...layout.sectionTitle,
    marginHorizontal: 0,
    marginTop: spacing.md,
  },
  empty: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.xl,
  },
  projectCard: {
    ...components.card,
    marginBottom: spacing.sm + 2,
  },
  projectTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.brandBlue,
  },
  projectSecteur: {
    color: colors.accentBlue,
    marginTop: spacing.xs,
  },
  projectBesoin: {
    color: colors.textBody,
    marginTop: spacing.xs,
  },
});
