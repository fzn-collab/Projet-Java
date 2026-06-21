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
import { getProjectsByUser } from "../services/apiService";
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

export default function MyProjectsScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchProjects);
    return unsubscribe;
  }, [navigation]);

  const fetchProjects = async () => {
    const ownerId = auth.currentUser?.uid;
    if (!ownerId) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getProjectsByUser(ownerId);
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Erreur:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    Alert.alert("Supprimer", "Tu veux vraiment supprimer ce projet ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          await fetch(`${API_URL}/api/projects/${id}`, { method: "DELETE" });
          fetchProjects();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.brandBlue} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="My Projects"
        subtitle={`${projects.length} projet${projects.length !== 1 ? "s" : ""}`}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("ProjectForm", { project: null })}
        >
          <Text style={styles.addButtonText}>+ Nouveau projet</Text>
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false}>
          {projects.length === 0 && (
            <Text style={styles.empty}>
              Aucun projet. Crée ton premier projet !
            </Text>
          )}

          {projects.map((project) => (
            <View key={project.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{project.titre}</Text>
                  <Text style={styles.cardSecteur}>🏢 {project.secteur}</Text>
                </View>

                <Text
                  style={[
                    styles.status,
                    {
                      backgroundColor:
                        project.statut === "actif"
                          ? colors.successBg
                          : colors.surfaceMuted,
                      color:
                        project.statut === "actif"
                          ? colors.success
                          : colors.textSubtle,
                    },
                  ]}
                >
                  {project.statut || "actif"}
                </Text>
              </View>

              <Text style={styles.cardBesoin}>Besoin : {project.besoin}</Text>

              <View style={styles.cardButtons}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() =>
                    navigation.navigate("ProjectForm", { project })
                  }
                >
                  <Text style={styles.btnText}>Modifier</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => deleteProject(project.id)}
                >
                  <Text style={styles.btnText}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: layout.screen,
  center: layout.center,
  content: {
    padding: spacing.xl - 2,
    flex: 1,
  },
  addButton: {
    ...components.buttonPrimary,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
  },
  addButtonText: components.buttonPrimaryText,
  empty: {
    textAlign: "center",
    color: colors.textSubtle,
    marginTop: 40,
    fontSize: typography.sizes.md,
  },
  card: {
    ...components.card,
    marginBottom: spacing.md + 2,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.brandBlue,
  },
  cardSecteur: {
    color: colors.textSubtle,
    marginTop: 5,
  },
  cardBesoin: {
    color: colors.textBody,
    marginTop: spacing.sm + 2,
  },
  status: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    overflow: "hidden",
  },
  cardButtons: {
    flexDirection: "row",
    marginTop: spacing.md + 2,
    gap: spacing.sm + 2,
  },
  editBtn: {
    backgroundColor: colors.accentBlue,
    padding: spacing.sm + 2,
    borderRadius: radius.md,
    flex: 1,
    alignItems: "center",
  },
  deleteBtn: {
    backgroundColor: colors.error,
    padding: spacing.sm + 2,
    borderRadius: radius.md,
    flex: 1,
    alignItems: "center",
  },
  btnText: {
    color: colors.textInverse,
    fontWeight: typography.weights.bold,
  },
});