import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getUser } from "../services/apiService";

export default function ProfileScreen({ route, navigation }) {
  const receivedUser = route.params?.user;
  const userId = receivedUser?.userId || receivedUser?.id;

  const [user, setUser] = useState(receivedUser || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      loadUser();
    }
  }, [userId]);

  async function loadUser() {
    try {
      setLoading(true);
      const data = await getUser(userId);
      console.log("USER DETAILS:", data);
      setUser(data);
    } catch (error) {
      console.log("GET USER ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0D47A1" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Aucun utilisateur sélectionné</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>User Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user.nom || user.name || "U").charAt(0)}
          </Text>
        </View>

        <Text style={styles.name}>{user.nom || user.name}</Text>
        <Text style={styles.sub}>{user.typeProfil || "Entrepreneur"}</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Information</Text>
          <Text style={styles.info}>Secteur : {user.secteur}</Text>
          <Text style={styles.info}>Besoin : {user.besoin}</Text>
          <Text style={styles.info}>Ville : {user.localisation?.ville}</Text>
          <Text style={styles.info}>Pays : {user.localisation?.pays}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Compétences</Text>
          <View style={styles.badges}>
            {user.competences?.map((comp, index) => (
              <Text key={index} style={styles.badge}>
                {comp}
              </Text>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryText}>Connect</Text>
        </TouchableOpacity>
      </ScrollView>
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
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  back: { color: "#fff", fontSize: 34 },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },

  content: {
    padding: 20,
    alignItems: "center",
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#0D47A1",
  },

  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0D47A1",
  },

  sub: {
    color: "#607D8B",
    marginTop: 4,
    marginBottom: 20,
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0D47A1",
    marginBottom: 10,
  },

  info: {
    color: "#455A64",
    marginBottom: 7,
  },

  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  badge: {
    backgroundColor: "#E3F2FD",
    color: "#0D47A1",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
  },

  primaryButton: {
    width: "100%",
    backgroundColor: "#0D47A1",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },

  primaryText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
