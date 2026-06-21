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
import ScreenHeader from "../components/ScreenHeader";
import { getProjectsByUser } from "../services/apiService";
import { auth } from "../services/authService";
import { colors, components, layout, radius, shadows, spacing, typography } from "../theme";

export default function ProjectScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [allProjects, setAllProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadMyProjects);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    applyFilter(query, allProjects);
  }, [query, allProjects]);

  async function loadMyProjects() {
    const ownerId = auth.currentUser?.uid;
    if (!ownerId) {
      setAllProjects([]);
      setProjects([]);
      return;
    }
    try {
      setLoading(true);
      const data = await getProjectsByUser(ownerId);
      const list = Array.isArray(data) ? data : [];
      setAllProjects(list);
      applyFilter(query, list);
    } catch (error) {
      console.log("PROJECT LOAD ERROR:", error);
      setAllProjects([]);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  function applyFilter(value, source) {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) { setProjects(source); return; }
    setProjects(
      source.filter((p) =>
        [p.titre, p.secteur, p.besoin, p.description]
          .filter(Boolean)
          .some((f) => f.toLowerCase().includes(trimmed)),
      ),
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Projects"
        subtitle={`${projects.length} projet${projects.length !== 1 ? "s" : ""}`}
      />

      {/* Bouton créer projet */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate("ProjectForm", { project: null })}
      >
        <Text style={styles.createButtonText}>+ Nouveau projet</Text>
      </TouchableOpacity>

      {/* Barre de recherche */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Rechercher dans vos projets..."
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={() => applyFilter(query, allProjects)}
          style={styles.searchButton}
        >
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Mes projets ({projects.length})</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.brandBlue}
          style={{ marginTop: 40 }}
        />
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
            <Text style={styles.empty}>
              Aucun projet. Crée ton premier projet !
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: layout.screen,
  createButton: {
    ...components.buttonPrimary,
    marginHorizontal: spacing.xl - 2,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
    borderRadius: radius.lg,
  },
  createButtonText: components.buttonPrimaryText,
  searchBox: {
    flexDirection: "row",
    margin: spacing.xl - 2,
    marginTop: spacing.md,
    backgroundColor: "#FFFFFF",
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