import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import UserCard from "../components/UserCard";
import { searchUsers } from "../services/apiService";

export default function SearchScreen({ navigation }) {
  const [skill, setSkill] = useState("");
  const [results, setResults] = useState([]);

  async function handleSearch() {
    const data = await searchUsers({ skill });
    setResults(data);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search Users</Text>
      </View>

      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search by skill, need or sector..."
          value={skill}
          onChangeText={setSkill}
          style={styles.input}
        />

        <TouchableOpacity onPress={handleSearch} style={styles.filterButton}>
          <Text style={styles.filterText}>🔍</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Results ({results.length})</Text>

      <FlatList
        contentContainerStyle={styles.list}
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            onPress={(user) => navigation.navigate("Profil", { user })}
          />
        )}
      />
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

  input: {
    flex: 1,
    height: 48,
    fontSize: 14,
  },

  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
  },

  filterText: { fontSize: 20 },

  sectionTitle: {
    marginHorizontal: 18,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#0D47A1",
  },

  list: { paddingHorizontal: 18, paddingBottom: 20 },
});
