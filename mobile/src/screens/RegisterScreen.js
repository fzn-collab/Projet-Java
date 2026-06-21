import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { registerUser } from "../services/authService";
import { colors, components, layout, spacing, typography } from "../theme";

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
        "http://10.130.182.153:8080/api/users/register",
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

      if (!response.ok) {
        throw new Error("Erreur backend : utilisateur non enregistré.");
      }

      Alert.alert("Succès", "Compte créé avec succès !");
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>Rejoignez Connecto</Text>

        <TextInput
          style={styles.input}
          placeholder="Nom complet"
          placeholderTextColor={colors.textMuted}
          value={nom}
          onChangeText={setNom}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor={colors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
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
          placeholder="Secteur : FinTech, EdTech..."
          placeholderTextColor={colors.textMuted}
          value={secteur}
          onChangeText={setSecteur}
        />

        <TextInput
          style={styles.input}
          placeholder="Compétences : Java, React, Marketing..."
          placeholderTextColor={colors.textMuted}
          value={competences}
          onChangeText={setCompetences}
        />

        <TextInput
          style={styles.input}
          placeholder="Besoin : Projet, Développeur, Investisseur..."
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

        <TouchableOpacity style={styles.btn} onPress={handleRegister}>
          <Text style={styles.btnText}>S'inscrire</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.xxl,
    paddingBottom: spacing.xxxl,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: typography.sizes.xxl + 6,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.sm,
    textAlign: "center",
    color: colors.brandBlue,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    marginBottom: spacing.xxxl,
    textAlign: "center",
    color: colors.textSecondary,
  },
  input: {
    ...components.input,
    marginBottom: spacing.lg,
  },
  btn: {
    ...components.buttonPrimary,
    marginBottom: spacing.lg,
  },
  btnText: components.buttonPrimaryText,
  link: {
    textAlign: "center",
    marginTop: spacing.sm,
    color: colors.accentBlue,
    fontSize: typography.sizes.sm,
  },
});