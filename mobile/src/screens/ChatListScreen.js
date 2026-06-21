import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ScreenHeader from "../components/ScreenHeader";
import {
  getMyProfile,
  getUser,
  getUserConversations,
} from "../services/apiService";
import { colors, spacing, typography } from "../theme";

export default function ChatListScreen({ navigation }) {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadConversations);
    return unsubscribe;
  }, [navigation]);

  async function loadConversations() {
    try {
      setLoading(true);

      const me = await getMyProfile();
      const myId = me?.id;
      setCurrentUserId(myId);

      if (!myId) {
        setConversations([]);
        return;
      }

      const data = await getUserConversations(myId);
      const list = Array.isArray(data) ? data : [];

      // On enrichit chaque conversation avec le profil de l'autre utilisateur
      const enriched = await Promise.all(
        list.map(async (conv) => {
          const otherUserId = Array.isArray(conv.participants)
            ? conv.participants.find((id) => id !== myId)
            : undefined;
          const otherUser = otherUserId ? await getUser(otherUserId) : null;
          return { ...conv, otherUserId, otherUser };
        })
      );

      setConversations(enriched);
    } catch (e) {
      console.log("CHAT LIST ERROR:", e);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }

  function openChat(conv) {
    if (!conv.otherUserId || !currentUserId) return;
    navigation.navigate("Chat", {
      conversationId: conv.id,
      currentUserId,
      otherUserId: conv.otherUserId,
    });
  }

  function getInitial(name) {
    return (name || "?").charAt(0).toUpperCase();
  }

  function formatTime(ts) {
    if (!ts) return "";
    const d = new Date(ts);
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.brandBlue} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Messages" subtitle="Vos conversations" />

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Pas encore de messages</Text>
            <Text style={styles.emptyText}>
              Connectez-vous avec d'autres entrepreneurs via Suggestions ou
              Search. Vos conversations apparaîtront ici.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => openChat(item)}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitial(item.otherUser?.nom)}
              </Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>
                {item.otherUser?.nom || "Utilisateur"}
              </Text>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {item.lastMessage || item.otherUser?.typeProfil || ""}
              </Text>
            </View>
            <Text style={styles.time}>{formatTime(item.lastMessageTime)}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  list: { paddingBottom: spacing.xl, flexGrow: 1 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xl - 2,
    paddingVertical: spacing.md + 2,
    gap: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.brandBluePale,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.brandBlue,
  },
  info: { flex: 1 },
  name: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  lastMessage: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  time: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xxxl,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyText: {
    textAlign: "center",
    color: colors.textSecondary,
    lineHeight: 22,
  },
});