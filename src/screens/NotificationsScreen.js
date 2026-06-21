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
  getNotifications,
  markNotificationAsRead,
} from "../services/apiService";

import { colors, spacing, radius, typography, layout } from "../theme";

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const profile = await getMyProfile();

      if (!profile) {
        setLoading(false);
        return;
      }

      const data = await getNotifications(profile.id);

      setNotifications(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log("NOTIFICATIONS ERROR =", e);
    } finally {
      setLoading(false);
    }
  }

  function getIcon(type) {
    switch (type) {
      case "message":
        return "💬";
      case "match":
        return "🤝";
      case "project":
        return "📋";
      default:
        return "🔔";
    }
  }

  function getColor(type) {
    switch (type) {
      case "message":
        return colors.brandBlue;
      case "match":
        return colors.success;
      case "project":
        return colors.warning;
      default:
        return colors.accentBlue;
    }
  }

  async function handlePress(item) {
    try {
      await markNotificationAsRead(item.id);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === item.id ? { ...n, read: true } : n
        )
      );

      if (item.type === "message") {
        navigation.navigate("Messages");
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function markAllRead() {
    try {
      await Promise.all(
        notifications
          .filter((n) => !n.read)
          .map((n) => markNotificationAsRead(n.id))
      );

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    } catch (e) {
      console.log(e);
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.brandBlue} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Notifications"
        subtitle={
          unreadCount > 0
            ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}`
            : "Tout est à jour"
        }
        onBack={() => navigation.goBack()}
        rightAction={
          unreadCount > 0 ? (
            <TouchableOpacity onPress={markAllRead}>
              <Text style={styles.markAllText}>Tout lire</Text>
            </TouchableOpacity>
          ) : null
        }
      />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>
              Aucune notification
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.notifItem,
              !item.read && styles.unreadItem,
            ]}
            onPress={() => handlePress(item)}
          >
            <View
              style={[
                styles.icon,
                { backgroundColor: getColor(item.type) + "20" },
              ]}
            >
              <Text>{getIcon(item.type)}</Text>
            </View>

            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.text}>{item.content}</Text>
            </View>

            {!item.read && (
              <View
                style={[
                  styles.dot,
                  { backgroundColor: getColor(item.type) },
                ]}
              />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...layout.screen,
  },

  loading: {
    ...layout.center,
  },

  list: {
    paddingBottom: spacing.xl,
  },

  notifItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.md,
  },

  unreadItem: {
    backgroundColor: colors.brandBluePale,
  },

  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },

  text: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  emptyContainer: {
    ...layout.center,
    marginTop: 80,
  },

  emptyIcon: {
    fontSize: 40,
  },

  emptyTitle: {
    marginTop: spacing.sm,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },

  markAllText: {
    color: colors.accentBlue,
    fontWeight: "600",
  },
});