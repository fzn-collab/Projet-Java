import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import ScreenHeader from "../components/ScreenHeader";
import UserCard from "../components/UserCard";
import { searchUsers } from "../services/apiService";
import { colors, layout, radius, shadows, spacing, typography } from "../theme";

export default function SearchScreen({ navigation }) {
  const [skill, setSkill] = useState("");
  const [results, setResults] = useState([]);

  async function handleSearch() {
    const data = await searchUsers({ skill });
    setResults(data);
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Search Users"
        subtitle="Trouvez des profils par compétence ou secteur"
      />

      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search by skill, need or sector..."
          placeholderTextColor={colors.textMuted}
          value={skill}
          onChangeText={setSkill}
          style={styles.input}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>🔍</Text>
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
        ListEmptyComponent={
          results.length === 0 && skill.length > 0 ? (
            <Text style={styles.empty}>Aucun résultat trouvé.</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: layout.screen,
  searchBox: {
    flexDirection: "row",
    margin: spacing.xl - 2,
    backgroundColor: colors.surface,
    borderRadius: radius.lg + 2,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    ...shadows.card,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.brandBluePale,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButtonText: { fontSize: typography.sizes.xl },
  sectionTitle: layout.sectionTitle,
  list: layout.listContent,
  empty: {
    textAlign: "center",
    marginTop: 30,
    color: colors.textSubtle,
    fontSize: typography.sizes.md,
  },
});