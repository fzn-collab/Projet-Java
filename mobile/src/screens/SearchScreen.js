import { useState } from "react";
import {
  FlatList,
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
    try {
      const data = await searchUsers({ skill });
      setResults(data);
    } catch (error) {
      console.log(error);
    }
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
        Search
      </Text>

      <View
        style={{
          flexDirection: "row",
          marginBottom: 20,
        }}
      >
        <TextInput
          placeholder="Skill"
          value={skill}
          onChangeText={setSkill}
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
