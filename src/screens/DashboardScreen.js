import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const API_URL = "http://192.168.0.105:8083";

export default function DashboardScreen({ navigation }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = "user123";

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
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
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🚀 Mon Dashboard</Text>

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
        <Text style={styles.buttonText}>📋 Voir mes projets</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonGreen]}
        onPress={() => navigation.navigate("ProjectForm", { project: null })}
      >
        <Text style={styles.buttonText}>➕ Créer un projet</Text>
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333" },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    flex: 0.48,
    alignItems: "center",
    elevation: 3,
  },
  statNumber: { fontSize: 32, fontWeight: "bold", color: "#4CAF50" },
  statLabel: { fontSize: 12, color: "#666", marginTop: 4 },
  button: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonGreen: { backgroundColor: "#4CAF50" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  empty: { color: "#999", textAlign: "center", marginTop: 20 },
  projectCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  projectTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  projectSecteur: { color: "#2196F3", marginTop: 4 },
  projectBesoin: { color: "#666", marginTop: 4 },
});
