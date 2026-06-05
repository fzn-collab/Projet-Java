import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ProjectDetailsScreen({ route, navigation }) {
  const { project } = route.params;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <View
        style={{
          height: 220,
          backgroundColor: "#2F4157",
          justifyContent: "center",
          alignItems: "center",
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: "absolute",
            left: 20,
            top: 60,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 30,
            }}
          >
            ←
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 42,
            fontWeight: "bold",
            color: "white",
          }}
        >
          Project
        </Text>
      </View>

      <ScrollView
        style={{
          padding: 25,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#2F4157",
            marginBottom: 20,
          }}
        >
          {project.titre}
        </Text>

        <Text
          style={{
            fontSize: 18,
            marginBottom: 10,
          }}
        >
          Sector : {project.secteur}
        </Text>

        <Text
          style={{
            fontSize: 18,
            marginBottom: 20,
          }}
        >
          Need : {project.besoin}
        </Text>

        <Text
          style={{
            fontSize: 16,
            lineHeight: 24,
          }}
        >
          {project.description}
        </Text>
      </ScrollView>
    </View>
  );
}
