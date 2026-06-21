import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import ScreenHeader from "../components/ScreenHeader";
import { updateMyProfile } from "../services/apiService";
import { colors, components, layout, radius, spacing, typography } from "../theme";

export default function EditProfileScreen({ route, navigation }) {
  const user = route.params?.user;

  const [nom, setNom] = useState(user?.nom || "");
  const [typeProfil, setTypeProfil] = useState(user?.typeProfil || "");
  const [secteur, setSecteur] = useState(user?.secteur || "");
  const [competences, setCompetences] = useState(
    user?.competences?.join(", ") || "",
  );
  const [besoin, setBesoin] = useState(user?.besoin || "");
  const [ville, setVille] = useState(user?.localisation?.ville || "");
  const [pays, setPays] = useState(user?.localisation?.pays || "");

  async function handleUpdate() {
    if (
      !nom.trim() ||
      !typeProfil.trim() ||
      !secteur.trim() ||
      !competences.trim() ||
      !besoin.trim() ||
      !ville.trim() ||
      !pays.trim()
    ) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    try {
      await updateMyProfile({
        nom: nom.trim(),
        typeProfil: typeProfil.trim().toUpperCase(),
        secteur: secteur.trim(),
        competences: competences.split(",").map((c) => c.trim()),
        besoin: besoin.trim(),
        localisation: {
          ville: ville.trim(),
          pays: pays.trim(),
        },
      });

      Alert.alert("Succès", "Profil modifié avec succès !");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erreur", "Impossible de modifier le profil.");
      console.log("EDIT PROFILE ERROR:", error);
    }
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Edit Profile"
        subtitle="Mettez à jour vos informations"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Nom complet"
          placeholderTextColor={colors.textMuted}
          value={nom}
          onChangeText={setNom}
        />

        <TextInput
          style={styles.input}
          placeholder="Type profil : DEVELOPPEUR, INVESTISSEUR..."
          placeholderTextColor={colors.textMuted}
          value={typeProfil}
          onChangeText={setTypeProfil}
        />

        <TextInput
          style={styles.input}
          placeholder="Secteur"
          placeholderTextColor={colors.textMuted}
          value={secteur}
          onChangeText={setSecteur}
        />

        <TextInput
          style={styles.input}
          placeholder="Compétences séparées par virgule"
          placeholderTextColor={colors.textMuted}
          value={competences}
          onChangeText={setCompetences}
        />

        <TextInput
          style={styles.input}
          placeholder="Besoin"
          placeholderTextColor={colors.textMuted}
          value={besoin}
          onChangeText={setBesoin}
        />

        <TextInput
          style={styles.input}
          placeholder="Ville"
          placeholderTextColor={colors.textMuted}
          value={ville}
          onChangeText={setVille}
        />

        <TextInput
          style={styles.input}
          placeholder="Pays"
          placeholderTextColor={colors.textMuted}
          value={pays}
          onChangeText={setPays}
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Enregistrer</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: layout.screen,
  content: {
    padding: spacing.xl,
    paddingTop: spacing.md,
  },
  input: {
    ...components.input,
    borderRadius: radius.lg - 2,
    padding: spacing.lg - 1,
    marginBottom: spacing.md + 2,
    borderColor: colors.brandBluePale,
  },
  button: {
    ...components.buttonPrimary,
    borderRadius: radius.lg - 2,
    marginTop: spacing.sm + 2,
  },
  buttonText: components.buttonPrimaryText,
});
