import { useState } from "react";
import {
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import ProjectCard from "../components/ProjectCard";
import { searchProjects } from "../services/apiService";

export default function ProjectScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState([]);

  async function handleSearch() {
    const data = await searchProjects({
      secteur: query,
      besoin: query,
    });

    setProjects(data);
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 34,
          fontWeight: "bold",
          color: "#2F4157",
          marginBottom: 25,
        }}
      >
        Projects
      </Text>

      <View
        style={{
          flexDirection: "row",
          marginBottom: 20,
        }}
      >
        <TextInput
          placeholder="Sector or Need"
          value={query}
          onChangeText={setQuery}
          style={{
            flex: 1,
            backgroundColor: "#C7D9E5",
            borderRadius: 25,
            paddingHorizontal: 20,
            height: 50,
          }}
        />

        <TouchableOpacity
          onPress={handleSearch}
          style={{
            marginLeft: 10,
            backgroundColor: "#F4EFEB",
            borderRadius: 20,
            paddingHorizontal: 20,
            justifyContent: "center",

            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.15,
            shadowRadius: 3,
            elevation: 4,
          }}
        >
          <Text>Search</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={projects}
        keyExtractor={(item) => item.id || item._id}
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={(project) =>
              navigation.navigate("ProjetDetails", {
                project,
              })
            }
          />
        )}
      />
    </View>
  );
}
