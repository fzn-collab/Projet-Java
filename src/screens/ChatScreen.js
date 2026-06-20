import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { getMessages, markAsRead, sendMessage } from "../services/apiService";

export default function ChatScreen({ route }) {
  const { conversationId, currentUserId, otherUserId } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef(null);

  const loadMessages = async () => {
    try {
      const data = await getMessages(conversationId);
      setMessages(data);
      await markAsRead(conversationId, currentUserId);
    } catch (error) {
      console.error("Erreur messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || sending) return;
    setSending(true);
    try {
      const newMessage = await sendMessage(
        conversationId,
        currentUserId,
        otherUserId,
        inputText.trim(),
      );
      setMessages((prev) => [...prev, newMessage]);
      setInputText("");
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error("Erreur envoi:", error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return "Aujourd'hui";
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>
            {otherUserId?.charAt(0).toUpperCase()}
          </Text>
          <View style={styles.onlineIndicator} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{otherUserId}</Text>
          <Text style={styles.headerStatus}>En ligne</Text>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>💬</Text>
              <Text style={styles.emptyTitle}>Démarrez la conversation</Text>
              <Text style={styles.emptySubtitle}>
                Envoyez votre premier message à {otherUserId}
              </Text>
            </View>
          }
          renderItem={({ item, index }) => {
            const isMyMessage = item.senderId === currentUserId;
            const showDate =
              index === 0 ||
              formatDate(messages[index - 1]?.timestamp) !==
                formatDate(item.timestamp);

            return (
              <View>
                {showDate && (
                  <View style={styles.dateSeparator}>
                    <View style={styles.dateLine} />
                    <Text style={styles.dateText}>
                      {formatDate(item.timestamp)}
                    </Text>
                    <View style={styles.dateLine} />
                  </View>
                )}
                <View
                  style={[
                    styles.messageRow,
                    isMyMessage ? styles.myRow : styles.theirRow,
                  ]}
                >
                  {!isMyMessage && (
                    <View style={styles.smallAvatar}>
                      <Text style={styles.smallAvatarText}>
                        {item.senderId?.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                  <View
                    style={[
                      styles.bubble,
                      isMyMessage ? styles.myBubble : styles.theirBubble,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        isMyMessage
                          ? styles.myMessageText
                          : styles.theirMessageText,
                      ]}
                    >
                      {item.content}
                    </Text>
                    <View style={styles.messageFooter}>
                      <Text
                        style={[
                          styles.timeText,
                          isMyMessage
                            ? styles.myTimeText
                            : styles.theirTimeText,
                        ]}
                      >
                        {formatTime(item.timestamp)}
                      </Text>
                      {isMyMessage && (
                        <Text style={styles.readStatus}>
                          {item.read ? " ✓✓" : " ✓"}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />

        {/* Input */}
        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Écrire un message..."
              placeholderTextColor="#999"
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || sending) && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={!inputText.trim() || sending}
            >
              {sending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.sendIcon}>➤</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F2F5" },
  flex: { flex: 1 },
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
    paddingHorizontal: 15,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    position: "relative",
  },
  headerAvatarText: { color: "white", fontSize: 18, fontWeight: "bold" },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#1A73E8",
  },
  headerInfo: { flex: 1 },
  headerName: { color: "white", fontSize: 17, fontWeight: "700" },
  headerStatus: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 1 },

  // Messages
  messagesList: { paddingVertical: 15, paddingHorizontal: 10 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyIcon: { fontSize: 50, marginBottom: 15 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    paddingHorizontal: 30,
  },

  // Date separator
  dateSeparator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  dateLine: { flex: 1, height: 1, backgroundColor: "#DDD" },
  dateText: {
    marginHorizontal: 10,
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
  },

  // Message bubbles
  messageRow: {
    flexDirection: "row",
    marginVertical: 3,
    alignItems: "flex-end",
  },
  myRow: { justifyContent: "flex-end" },
  theirRow: { justifyContent: "flex-start" },
  smallAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#1A73E8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 2,
  },
  smallAvatarText: { color: "white", fontSize: 12, fontWeight: "bold" },
  bubble: {
    maxWidth: "72%",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  myBubble: {
    backgroundColor: "#1A73E8",
    borderBottomRightRadius: 4,
    marginLeft: 50,
  },
  theirBubble: {
    backgroundColor: "white",
    borderBottomLeftRadius: 4,
  },
  messageText: { fontSize: 15, lineHeight: 21 },
  myMessageText: { color: "white" },
  theirMessageText: { color: "#1A1A1A" },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    justifyContent: "flex-end",
  },
  timeText: { fontSize: 11 },
  myTimeText: { color: "rgba(255,255,255,0.75)" },
  theirTimeText: { color: "#999" },
  readStatus: { fontSize: 11, color: "rgba(255,255,255,0.75)" },

  // Input
  inputWrapper: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
    paddingVertical: 8,
    paddingHorizontal: 12,
    paddingBottom: 25,
  },
  inputContainer: { flexDirection: "row", alignItems: "flex-end" },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    color: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1A73E8",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    elevation: 2,
  },
  sendButtonDisabled: { backgroundColor: "#B0C4DE" },
  sendIcon: { color: "white", fontSize: 18 },
});
