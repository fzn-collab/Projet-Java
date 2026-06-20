import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleSearch("");
  }, []);

  async function handleSearch(value = query) {
    try {
      setLoading(true);

      const data = await searchProjects({
        besoin: value.trim(),
      });

      console.log("PROJECTS:", data);
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("PROJECT SEARCH ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Projects</Text>
      </View>

      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search by need, e.g. Java..."
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />

        <TouchableOpacity onPress={() => handleSearch()} style={styles.button}>
          <Text style={styles.buttonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Projects List ({projects.length})</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0D47A1" />
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={projects}
          keyExtractor={(item) => item.id || item._id}
          renderItem={({ item }) => (
            <ProjectCard
              project={item}
              onPress={(project) =>
                navigation.navigate("ProjetDetails", { project })
              }
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No projects found.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 18,
    backgroundColor: "#0D47A1",
  },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  searchBox: {
    flexDirection: "row",
    margin: 18,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  input: { flex: 1, height: 48, fontSize: 14 },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { fontSize: 20 },
  sectionTitle: {
    marginHorizontal: 18,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#0D47A1",
  },
  list: { paddingHorizontal: 18, paddingBottom: 20 },
  empty: {
    textAlign: "center",
    marginTop: 30,
    color: "#607D8B",
  },
});
