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
import {
  getOrCreateConversation,
  getUser,
  getMyProfile,
} from "../services/apiService";

import {
  colors,
  components,
  layout,
  radius,
  spacing,
  typography,
} from "../theme";

export default function ProfileScreen({ route, navigation }) {
  const receivedUser = route.params?.user;
  const profileUserId = receivedUser?.id || receivedUser?.userId;

  const [user, setUser] = useState(receivedUser || null);
  const [loading, setLoading] = useState(false);
  const [openingChat, setOpeningChat] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const isOwnProfile =
    currentUserId && profileUserId && currentUserId === profileUserId;

  useEffect(() => {
    loadCurrentUser();
    if (profileUserId) {
      loadUser();
    }
  }, [profileUserId]);

  async function loadCurrentUser() {
    try {
      const me = await getMyProfile();
      console.log("MY PROFILE =", me);
      console.log("MY MONGO ID =", me?.id);
      setCurrentUserId(me?.id);
    } catch (error) {
      console.log("LOAD CURRENT USER ERROR:", error);
    }
  }

  async function loadUser() {
    try {
      setLoading(true);
      console.log("PROFILE USER ID =", profileUserId);
      const data = await getUser(profileUserId);
      console.log("PROFILE DATA =", data);
      setUser(data);
    } catch (error) {
      console.log("GET USER ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleMessage() {
    try {
      const me = await getMyProfile();
      const myId = me?.id;
      const otherId = route.params?.user?.id || route.params?.user?.userId;

      console.log("CURRENT USER =", myId);
      console.log("OTHER USER =", otherId);

      if (!myId || !otherId) {
        Alert.alert("Erreur", `myId=${myId} otherId=${otherId}`);
        return;
      }

      if (myId === otherId) return;

      setOpeningChat(true);

      const conversation = await getOrCreateConversation(myId, otherId);
      console.log("CONVERSATION =", conversation);

      if (!conversation?.id) throw new Error("Conversation ID missing");

      navigation.navigate("Chat", {
        conversationId: conversation.id,
        currentUserId: myId,
        otherUserId: otherId,
      });
    } catch (error) {
      console.log("OPEN CHAT ERROR:", error);
      Alert.alert("Erreur", "Impossible de créer la conversation");
    } finally {
      setOpeningChat(false);
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
        <Text style={styles.emptyText}>Aucun utilisateur sélectionné</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Profil"
        subtitle={user.nom || user.name}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user.nom || user.name || "U").charAt(0)}
          </Text>
        </View>

        <Text style={styles.name}>{user.nom || user.name}</Text>
        <Text style={styles.sub}>{user.typeProfil}</Text>

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

        {!isOwnProfile && (
          <TouchableOpacity
            style={[
              styles.primaryButton,
              openingChat && styles.primaryButtonDisabled,
            ]}
            onPress={handleMessage}
            disabled={openingChat}
          >
            {openingChat ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.primaryText}>✉️ Envoyer un message</Text>
            )}
          </TouchableOpacity>
        )}
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
    paddingTop: spacing.md,
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
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.brandBlue,
    marginBottom: spacing.sm,
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
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.md,
    fontSize: typography.sizes.xs,
  },
  primaryButton: {
    ...components.buttonPrimary,
    width: "100%",
    borderRadius: radius.lg - 2,
    marginTop: spacing.sm,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryText: components.buttonPrimaryText,
});