import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors, layout, radius, shadows, spacing, typography } from "../theme";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>Connecto</Text>
          <Text style={styles.hello}>Hello</Text>
          <Text style={styles.subtitle}>
            We are here to help you connect, collaborate and grow your ideas.
          </Text>
        </View>

        <TouchableOpacity style={styles.notification}>
          <Ionicons
            name="notifications-outline"
            size={22}
            color={colors.brandBlue}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Suggestions")}
        >
          <View>
            <Text style={styles.cardTitle}>Suggestions</Text>
            <Text style={styles.cardText}>
              Find people you might collaborate with
            </Text>
          </View>
          <Ionicons name="people" size={38} color={colors.accentBlueLight} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Search")}
        >
          <View>
            <Text style={styles.cardTitle}>Search</Text>
            <Text style={styles.cardText}>
              Search for users by skills, needs or sector
            </Text>
          </View>
          <Ionicons name="search" size={40} color="#26A69A" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Projects")}
        >
          <View>
            <Text style={styles.cardTitle}>Projects</Text>
            <Text style={styles.cardText}>
              Discover and collaborate on amazing projects
            </Text>
          </View>
          <Ionicons name="folder" size={38} color="#FBC02D" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Messages")}
        >
          <View>
            <Text style={styles.cardTitle}>Messages</Text>
            <Text style={styles.cardText}>Chat with your connections</Text>
          </View>
          <Ionicons
            name="chatbubble-ellipses"
            size={36}
            color={colors.brandBlue}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <View>
            <Text style={styles.cardTitle}>Dashboard</Text>
            <Text style={styles.cardText}>View Your Dashboard</Text>
          </View>
          <Ionicons name="people-circle" size={38} color={colors.brandBlue} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("MyProfile")}
        >
          <View>
            <Text style={styles.cardTitle}>My Profile</Text>
            <Text style={styles.cardText}>View your personal profile</Text>
          </View>
          <Ionicons name="person-circle" size={38} color={colors.brandBlue} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Notifications")}
        >
          <View>
            <Text style={styles.cardTitle}>Notifications</Text>
            <Text style={styles.cardText}>View your Notifications</Text>
          </View>
          <Ionicons
            name="notifications"
            size={38}
            color={colors.brandBlue}
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: layout.screen,
  header: {
    ...layout.tabHeader,
    paddingTop: 70,
    paddingBottom: 35,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logo: {
    color: colors.textInverse,
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xxl,
  },
  hello: {
    color: colors.textInverse,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
  },
  subtitle: {
    color: colors.brandBluePale,
    fontSize: typography.sizes.sm,
    lineHeight: 21,
    marginTop: spacing.sm,
    width: 260,
  },
  notification: {
    backgroundColor: colors.surface,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  content: layout.scrollContentOverlap,
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg + 2,
    padding: spacing.xl - 2,
    marginBottom: spacing.md + 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...shadows.card,
  },
  cardTitle: {
    color: colors.brandBlue,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginBottom: 5,
  },
  cardText: {
    color: colors.textSubtle,
    fontSize: typography.sizes.sm - 1,
    width: 230,
    lineHeight: 18,
  },
});
