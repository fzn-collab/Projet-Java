import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getMessages,
  sendMessage,
  markAsRead,
  getUser,
} from "../services/apiService";

export default function ChatScreen({ route, navigation }) {
  // route.params peut être undefined si l'écran est ouvert sans venir
  // d'une conversation précise (ex: navigation directe sur l'onglet) :
  // on évite le crash avec un fallback.
  const { conversationId, currentUserId, otherUserId } = route.params || {};

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const flatListRef = useRef(null);

  const loadUser = async () => {
    try {
      if (!otherUserId) return;
      const user = await getUser(otherUserId);
      setOtherUser(user);
    } catch (e) {}
  };

  const loadMessages = async () => {
    try {
      const data = await getMessages(conversationId);
      setMessages(Array.isArray(data) ? data : []);
      await markAsRead(conversationId, currentUserId);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }
    loadMessages();
    loadUser();
    const t = setInterval(loadMessages, 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  const send = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const msg = await sendMessage(
        conversationId,
        currentUserId,
        otherUserId,
        text.trim()
      );
      setMessages((prev) => [...prev, msg]);
      setText("");
    } catch (e) {
      console.log(e);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (ts) => {
    if (!ts) return "";
    const d = new Date(ts);
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  const getInitial = (name) => (name || "?").charAt(0).toUpperCase();

  if (!conversationId) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "#64748B" }}>Aucune conversation sélectionnée.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>
            {getInitial(otherUser?.nom)}
          </Text>
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>
            {otherUser?.nom || "Conversation"}
          </Text>
          <Text style={styles.headerSub}>
            {otherUser?.typeProfil || ""}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* MESSAGES */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const isMe = item.senderId === currentUserId;
            const prevItem = messages[index - 1];
            const showTime =
              !prevItem ||
              new Date(item.timestamp) - new Date(prevItem.timestamp) > 300000;

            return (
              <>
                {showTime && (
                  <Text style={styles.timeLabel}>
                    {formatTime(item.timestamp)}
                  </Text>
                )}
                <View
                  style={[
                    styles.msgRow,
                    isMe ? styles.msgRowMe : styles.msgRowOther,
                  ]}
                >
                  {!isMe && (
                    <View style={styles.msgAvatar}>
                      <Text style={styles.msgAvatarText}>
                        {getInitial(otherUser?.nom)}
                      </Text>
                    </View>
                  )}
                  <View
                    style={[
                      styles.bubble,
                      isMe ? styles.bubbleMe : styles.bubbleOther,
                    ]}
                  >
                    <Text
                      style={[
                        styles.bubbleText,
                        isMe ? styles.bubbleTextMe : styles.bubbleTextOther,
                      ]}
                    >
                      {item.content}
                    </Text>
                  </View>
                </View>
              </>
            );
          }}
        />

        {/* INPUT */}
        <View style={styles.inputBar}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Écrire un message..."
            placeholderTextColor="#94A3B8"
            style={styles.input}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            onPress={send}
            style={[styles.sendBtn, (!text.trim() || sending) && styles.sendBtnDisabled]}
            disabled={!text.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="send" size={18} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },

  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#051D40",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0066FF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatarText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  headerSub: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    marginTop: 1,
  },

  // LIST
  list: {
    padding: 16,
    paddingBottom: 8,
  },
  timeLabel: {
    textAlign: "center",
    fontSize: 11,
    color: "#94A3B8",
    marginVertical: 12,
  },
  msgRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 6,
    gap: 8,
  },
  msgRowMe: {
    justifyContent: "flex-end",
  },
  msgRowOther: {
    justifyContent: "flex-start",
  },
  msgAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E8F1FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  msgAvatarText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0066FF",
  },
  bubble: {
    maxWidth: "72%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleMe: {
    backgroundColor: "#0066FF",
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextMe: {
    color: "#FFFFFF",
  },
  bubbleTextOther: {
    color: "#051D40",
  },

  // INPUT
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: "#051D40",
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0066FF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0066FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sendBtnDisabled: {
    backgroundColor: "#CBD5E1",
    shadowOpacity: 0,
    elevation: 0,
  },
});