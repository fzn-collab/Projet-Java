import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

import MatchCard from "../components/MatchCard";
import { getSuggestions } from "../services/apiService";

export default function SuggestionsScreen({ navigation }) {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const data = await getSuggestions();
    setMatches(data);
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <LinearGradient
        colors={["#2F4157", "#B2D8EB"]}
        style={{
          paddingTop: 80,
          paddingBottom: 40,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 42,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Suggestions
        </Text>
      </LinearGradient>

      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
        data={matches}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => (
          <MatchCard
            match={item}
            onPress={(user) => navigation.navigate("Profil", { user })}
          />
        )}
      />
    </View>
  );
}
