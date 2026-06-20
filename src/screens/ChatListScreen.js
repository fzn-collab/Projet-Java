import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { getUserConversations } from "../services/apiService";

import { auth } from "../services/authService";

const CURRENT_USER_ID = auth.currentUser?.uid;

export default function ChatListScreen({ navigation }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadConversations = async () => {
    try {
      const data = await getUserConversations(CURRENT_USER_ID);
      setConversations(data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A73E8" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{conversations.length}</Text>
        </View>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadConversations();
            }}
            colors={["#1A73E8"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyTitle}>Aucune conversation</Text>
            <Text style={styles.emptySubtitle}>
              Connectez-vous avec des entrepreneurs et démarrez une conversation
              !
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const otherUser = item.participants.find(
            (p) => p !== CURRENT_USER_ID,
          );
          const colors = [
            "#1A73E8",
            "#E91E63",
            "#4CAF50",
            "#FF9800",
            "#9C27B0",
          ];
          const colorIndex = otherUser?.charCodeAt(0) % colors.length;
          const avatarColor = colors[colorIndex];

          return (
            <TouchableOpacity
              style={styles.conversationItem}
              onPress={() =>
                navigation.navigate("Chat", {
                  conversationId: item.id,
                  currentUserId: CURRENT_USER_ID,
                  otherUserId: otherUser,
                })
              }
              activeOpacity={0.7}
            >
              <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
                <Text style={styles.avatarText}>
                  {otherUser?.charAt(0).toUpperCase()}
                </Text>
                <View style={styles.onlineIndicator} />
              </View>

              <View style={styles.conversationInfo}>
                <View style={styles.conversationHeader}>
                  <Text style={styles.userName}>{otherUser}</Text>
                  <Text style={styles.timeText}>
                    {formatTime(item.lastMessageTime)}
                  </Text>
                </View>
                <View style={styles.lastMessageRow}>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    {item.lastMessage || "Démarrez la conversation..."}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F2F5" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F2F5",
  },
  loadingText: { marginTop: 10, color: "#666", fontSize: 16 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A73E8",
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitle: { color: "white", fontSize: 22, fontWeight: "700", flex: 1 },
  headerBadge: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  headerBadgeText: { color: "white", fontSize: 14, fontWeight: "600" },

  // Empty
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyIcon: { fontSize: 60, marginBottom: 20 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#888",
    textAlign: "center",
    lineHeight: 22,
  },

  // Conversation item
  conversationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    position: "relative",
  },
  avatarText: { color: "white", fontSize: 22, fontWeight: "700" },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "white",
  },
  conversationInfo: { flex: 1 },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  userName: { fontSize: 16, fontWeight: "700", color: "#1A1A1A" },
  timeText: { fontSize: 12, color: "#999" },
  lastMessageRow: { flexDirection: "row", alignItems: "center" },
  lastMessage: { fontSize: 14, color: "#666", flex: 1 },
  separator: { height: 1, backgroundColor: "#F0F0F0", marginLeft: 84 },
});
