import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
} from "react-native";

import MatchCard from "../components/MatchCard";
import ScreenHeader from "../components/ScreenHeader";
import { getMyProfile, getSuggestions } from "../services/apiService";
import { colors, layout, spacing } from "../theme";

export default function SuggestionsScreen({ navigation }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const profile = await getMyProfile();

      console.log("PROFILE =", profile);
      console.log("PROFILE ID =", profile?.id);
      console.log("FIREBASE UID =", profile?.firebaseUid);

      const data = await getSuggestions();

      console.log("SUGGESTIONS =", data);

      setMatches(data || []);
    } catch (error) {
      console.log("ERROR =", error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Suggestions"
        subtitle="Profils compatibles pour vous"
        onBack={() => navigation.goBack()}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.brandBlue} />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={matches}
          keyExtractor={(item, index) =>
            item.userId || item.id || String(index)
          }
          renderItem={({ item }) => (
            <MatchCard
              match={item}
              onPress={(user) =>
                navigation.navigate("Profil", { user })
              }
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: layout.screen,
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: spacing.xl - 2,
    paddingTop: spacing.md,
  },
});