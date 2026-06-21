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
import { getMyProfile } from "../services/apiService";
import { auth } from "../services/authService";
import {
  colors,
  components,
  layout,
  radius,
  spacing,
  typography,
} from "../theme";

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
        <ActivityIndicator size="large" color={colors.brandBlue} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Aucun profil trouvé</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="My Profile"
        subtitle={user.nom || ""}
      />

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
  container: layout.screen,
  center: layout.center,
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
  },
  content: {
    ...layout.scrollContent,
    paddingTop: spacing.xl,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.brandBluePale,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.bold,
    color: colors.brandBlue,
  },
  name: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.brandBlue,
  },
  sub: {
    color: colors.textSubtle,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  card: {
    ...components.card,
    width: "100%",
    marginBottom: spacing.md + 2,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.brandBlue,
    marginBottom: spacing.sm + 2,
  },
  info: {
    color: colors.textBody,
    marginBottom: 7,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  badge: {
    backgroundColor: colors.brandBluePale,
    color: colors.brandBlue,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: radius.md,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    overflow: "hidden",
  },
  editButton: {
    ...components.buttonPrimary,
    width: "100%",
    borderRadius: radius.lg - 2,
    marginTop: spacing.sm + 2,
  },
  logoutButton: {
    width: "100%",
    backgroundColor: colors.error,
    padding: spacing.lg - 1,
    borderRadius: radius.lg - 2,
    alignItems: "center",
    marginTop: spacing.sm + 2,
  },
  buttonText: components.buttonPrimaryText,
});