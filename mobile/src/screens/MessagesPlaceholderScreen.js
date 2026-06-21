import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import ScreenHeader from "../components/ScreenHeader";
import { colors, spacing, typography } from "../theme";

export default function MessagesPlaceholderScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Messages" subtitle="Vos conversations" />

      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons name="chatbubbles-outline" size={48} color={colors.accentBlue} />
        </View>
        <Text style={styles.title}>Pas encore de messages</Text>
        <Text style={styles.body}>
          Connectez-vous avec d'autres entrepreneurs via Suggestions ou Search.
          Vos conversations apparaîtront ici.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xxxl,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.accentBluePale,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  body: {
    textAlign: "center",
    color: colors.textSecondary,
    lineHeight: 22,
    fontSize: typography.sizes.md,
  },
});
