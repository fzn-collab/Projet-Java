import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { loginUser } from "../services/authService";
import { colors, components, layout, spacing, typography } from "../theme";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      navigation.replace("MainApp");
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connecto</Text>
      <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>

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

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Pas de compte ? S'inscrire</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.link}>Mot de passe oublié ?</Text>
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
    fontSize: typography.sizes.md,
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
