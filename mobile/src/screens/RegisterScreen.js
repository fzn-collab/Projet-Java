import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { registerUser } from "../services/authService";

export default function RegisterScreen({ navigation }) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [typeProfil, setTypeProfil] = useState("");
  const [secteur, setSecteur] = useState("");
  const [competences, setCompetences] = useState("");
  const [besoin, setBesoin] = useState("");
  const [ville, setVille] = useState("");
  const [pays, setPays] = useState("");

  const handleRegister = async () => {
    if (
      !nom.trim() ||
      !email.trim() ||
      !password.trim() ||
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
      const userCredential = await registerUser(email.trim(), password);
      const firebaseUid = userCredential.user.uid;

      const response = await fetch(
        "http://192.168.0.105:8083/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nom: nom.trim(),
            email: email.trim(),
            firebaseUid,
            typeProfil: typeProfil.trim().toUpperCase(),
            secteur: secteur.trim(),
            competences: competences.split(",").map((c) => c.trim()),
            besoin: besoin.trim(),
            localisation: {
              ville: ville.trim(),
              pays: pays.trim(),
            },
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Erreur backend : utilisateur non enregistré.");
      }

      console.log("USER CREATED:", data);

      Alert.alert("Succès", "Compte créé avec succès !");
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>
      <Text style={styles.subtitle}>Rejoignez ConnectEntrepreneurs</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom complet"
        value={nom}
        onChangeText={setNom}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Type profil : DEVELOPPEUR, INVESTISSEUR..."
        value={typeProfil}
        onChangeText={setTypeProfil}
      />

      <TextInput
        style={styles.input}
        placeholder="Secteur : FinTech, EdTech..."
        value={secteur}
        onChangeText={setSecteur}
      />

      <TextInput
        style={styles.input}
        placeholder="Compétences : Java, React, Marketing..."
        value={competences}
        onChangeText={setCompetences}
      />

      <TextInput
        style={styles.input}
        placeholder="Besoin : Projet, Développeur, Investisseur..."
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

      <TouchableOpacity style={styles.btn} onPress={handleRegister}>
        <Text style={styles.btnText}>S'inscrire</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#6C47FF",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: "center",
    color: "#888",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  btn: {
    backgroundColor: "#6C47FF",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  link: { textAlign: "center", marginTop: 8, color: "#6C47FF", fontSize: 14 },
});
