import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>Connecto</Text>
          <Text style={styles.hello}>Hey, Aya 👋</Text>
          <Text style={styles.subtitle}>
            We are here to help you connect, collaborate and grow your ideas.
          </Text>
        </View>

        <TouchableOpacity style={styles.notification}>
          <Ionicons name="notifications-outline" size={22} color="#0D47A1" />
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
          <Ionicons name="people" size={38} color="#4F7DF3" />
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
          <Ionicons name="chatbubble-ellipses" size={36} color="#1976D2" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <View>
            <Text style={styles.cardTitle}>Dashboard</Text>
            <Text style={styles.cardText}>View Your Dashboard</Text>
          </View>
          <Ionicons name="people-circle" size={38} color="#1565C0" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("MyProfile")}
        >
          <View>
            <Text style={styles.cardTitle}>My Profile</Text>
            <Text style={styles.cardText}>View your personal profile</Text>
          </View>
          <Ionicons name="person-circle" size={38} color="#0D47A1" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Notifications")}
        >
          <View>
            <Text style={styles.cardTitle}>Notifications</Text>
            <Text style={styles.cardText}>View your Notifications</Text>
          </View>
          <Ionicons name="person-circle" size={38} color="#0D47A1" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    backgroundColor: "#0D47A1",
    paddingTop: 70,
    paddingHorizontal: 24,
    paddingBottom: 35,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  logo: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
  },

  hello: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#E3F2FD",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    width: 260,
  },

  notification: {
    backgroundColor: "#fff",
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    padding: 20,
    marginTop: -22,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  cardTitle: {
    color: "#0D47A1",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },

  cardText: {
    color: "#607D8B",
    fontSize: 13,
    width: 230,
    lineHeight: 18,
  },
});
