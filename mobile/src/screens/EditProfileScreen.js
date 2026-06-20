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

import { updateMyProfile } from "../services/apiService";

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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Nom complet"
          value={nom}
          onChangeText={setNom}
        />

        <TextInput
          style={styles.input}
          placeholder="Type profil : DEVELOPPEUR, INVESTISSEUR..."
          value={typeProfil}
          onChangeText={setTypeProfil}
        />

        <TextInput
          style={styles.input}
          placeholder="Secteur"
          value={secteur}
          onChangeText={setSecteur}
        />

        <TextInput
          style={styles.input}
          placeholder="Compétences séparées par virgule"
          value={competences}
          onChangeText={setCompetences}
        />

        <TextInput
          style={styles.input}
          placeholder="Besoin"
          value={besoin}
          onChangeText={setBesoin}
        />

        <TextInput
          style={styles.input}
          placeholder="Ville"
          value={ville}
          onChangeText={setVille}
        />

        <TextInput
          style={styles.input}
          placeholder="Pays"
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
  container: { flex: 1, backgroundColor: "#F8FAFC" },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 18,
    backgroundColor: "#0D47A1",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  back: {
    color: "#fff",
    fontSize: 34,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  content: {
    padding: 20,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 15,
    marginBottom: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E3F2FD",
  },

  button: {
    backgroundColor: "#0D47A1",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
