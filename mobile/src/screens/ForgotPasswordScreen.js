import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { resetPassword } from "../services/authService";
import { colors, components, layout, spacing, typography } from "../theme";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    if (!email) return Alert.alert("Erreur", "Entrez votre email");
    try {
      await resetPassword(email);
      Alert.alert("Succès", "Email de réinitialisation envoyé !");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mot de passe oublié</Text>
      <Text style={styles.subtitle}>
        Entrez votre email pour recevoir un lien de réinitialisation
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.textMuted}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.btn} onPress={handleReset}>
        <Text style={styles.btnText}>Envoyer</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Retour à la connexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...layout.center,
    padding: spacing.xxl,
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
    fontSize: typography.sizes.sm,
    marginBottom: spacing.xxxl,
    textAlign: "center",
    color: colors.textSecondary,
  },
  input: {
    ...components.input,
    width: "100%",
    marginBottom: spacing.lg,
  },
  btn: {
    ...components.buttonPrimary,
    width: "100%",
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
