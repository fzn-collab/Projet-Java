import { Text, TouchableOpacity, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <LinearGradient
        colors={["#2F4157", "#B2D8EB"]}
        style={{
          height: 180,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 48,
            fontWeight: "bold",
          }}
        >
          Connecto
        </Text>
      </LinearGradient>

      <View
        style={{
          flex: 1,
          padding: 25,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            color: "#2F4157",
          }}
        >
          Hey, User
        </Text>

        <Text
          style={{
            textAlign: "center",
            fontSize: 20,
            marginTop: 15,
            color: "#2F4157",
          }}
        >
          We are here to help you connect, collaborate and grow your ideas.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Suggestions")}
        >
          <Text style={styles.text}>Suggestions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Recherche")}
        >
          <Text style={styles.text}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Projets")}
        >
          <Text style={styles.text}>Projects</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  button: {
    width: 280,
    backgroundColor: "#F4EFEB",
    padding: 18,
    borderRadius: 20,
    marginTop: 20,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },

  text: {
    color: "#2F4157",
    fontSize: 20,
    fontWeight: "600",
  },
};
