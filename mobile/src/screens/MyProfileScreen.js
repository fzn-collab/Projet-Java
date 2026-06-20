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
import { getMyProfile } from "../services/apiService";
import { auth } from "../services/authService";

export default function MyProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadProfile);
    return unsubscribe;
  }, [navigation]);

  async function loadProfile() {
    try {
      setLoading(true);
      const data = await getMyProfile();
      console.log("MY PROFILE:", data);
      setUser(data);
    } catch (error) {
      console.log("MY PROFILE ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await auth.signOut();
      navigation.getParent()?.getParent()?.replace("Login");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de se déconnecter.");
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
        <Text>Aucun profil trouvé</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.nom?.charAt(0) || "U"}</Text>
        </View>

        <Text style={styles.name}>{user.nom}</Text>
        <Text style={styles.sub}>{user.typeProfil || "Entrepreneur"}</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informations</Text>
          <Text style={styles.info}>Email : {user.email}</Text>
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

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditProfile", { user })}
        >
          <Text style={styles.buttonText}>Modifier mon profil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Se déconnecter</Text>
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
    paddingBottom: 22,
    backgroundColor: "#0D47A1",
  },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  content: { padding: 20, alignItems: "center" },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: { fontSize: 36, fontWeight: "bold", color: "#0D47A1" },
  name: { fontSize: 24, fontWeight: "bold", color: "#0D47A1" },
  sub: { color: "#607D8B", marginTop: 4, marginBottom: 20 },
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
  info: { color: "#455A64", marginBottom: 7 },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  badge: {
    backgroundColor: "#E3F2FD",
    color: "#0D47A1",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
  },
  editButton: {
    width: "100%",
    backgroundColor: "#0D47A1",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  logoutButton: {
    width: "100%",
    backgroundColor: "#EF5350",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
