import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import MatchCard from "../components/MatchCard";
import { getSuggestions } from "../services/apiService";

export default function SuggestionsScreen({ navigation }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await getSuggestions();
      setMatches(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Suggestions</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0D47A1" />
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={matches}
          keyExtractor={(item) => item.userId}
          renderItem={({ item }) => (
            <MatchCard
              match={item}
              onPress={(user) => navigation.navigate("Profil", { user })}
            />
          )}
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
    paddingBottom: 20,
    backgroundColor: "#0D47A1",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  back: { color: "#fff", fontSize: 34 },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  list: { padding: 18 },
});
