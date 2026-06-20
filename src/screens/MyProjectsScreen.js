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

const API_URL = "http://192.168.0.105:8083";

export default function MyProjectsScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchProjects);
    return unsubscribe;
  }, [navigation]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/projects`);
      const data = await response.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Erreur:", error);
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
        <ActivityIndicator size="large" color="#0D47A1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Projects</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("ProjectForm", { project: null })}
        >
          <Text style={styles.addButtonText}>+ Nouveau projet</Text>
        </TouchableOpacity>

        <ScrollView>
          {projects.length === 0 && (
            <Text style={styles.empty}>
              Aucun projet. Crée ton premier projet !
            </Text>
          )}

          {projects.map((project) => (
            <View key={project.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.cardTitle}>{project.titre}</Text>
                  <Text style={styles.cardSecteur}>🏢 {project.secteur}</Text>
                </View>

                <Text
                  style={[
                    styles.status,
                    {
                      backgroundColor:
                        project.statut === "actif" ? "#E8F5E9" : "#ECEFF1",
                      color: project.statut === "actif" ? "#2E7D32" : "#607D8B",
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
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 18,
    backgroundColor: "#0D47A1",
  },

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },

  content: {
    padding: 18,
    flex: 1,
  },

  addButton: {
    backgroundColor: "#0D47A1",
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  empty: {
    textAlign: "center",
    color: "#607D8B",
    marginTop: 40,
    fontSize: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0D47A1",
  },

  cardSecteur: {
    color: "#607D8B",
    marginTop: 5,
  },

  cardBesoin: {
    color: "#455A64",
    marginTop: 10,
  },

  status: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "bold",
  },

  cardButtons: {
    flexDirection: "row",
    marginTop: 14,
    gap: 10,
  },

  editBtn: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
  },

  deleteBtn: {
    backgroundColor: "#EF5350",
    padding: 10,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
