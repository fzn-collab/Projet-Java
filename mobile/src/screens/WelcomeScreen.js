import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function WelcomeScreen({ navigation }) {
  return (
    <LinearGradient colors={["#2F4157", "#B2D8EB"]} style={styles.container}>
      <Text style={styles.logo}>Connecto</Text>

      <Text style={styles.slogan}>Where Ideas Meet Opportunity</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    padding: 30,
  },

  logo: {
    fontSize: 54,
    fontWeight: "bold",
    color: "#fff",
  },

  slogan: {
    fontSize: 26,
    textAlign: "center",
    color: "#2F4157",
    fontWeight: "600",
  },

  button: {
    width: 250,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#B2D8EB",

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },

  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2F4157",
  },
});
