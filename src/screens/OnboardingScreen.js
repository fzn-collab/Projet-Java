import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors, components, radius, spacing, typography } from "../theme";

export default function OnboardingScreen({ navigation }) {
  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}
    >
      <Text style={styles.logo}>🤝</Text>
      <Text style={styles.title}>ConnectEntrepreneurs</Text>
      <Text style={styles.subtitle}>
        La plateforme qui connecte les entrepreneurs, co-fondateurs et
        investisseurs.
      </Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.btnText}>Commencer</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xxxl,
  },
  logo: { fontSize: 72, marginBottom: spacing.xxl },
  title: {
    fontSize: typography.sizes.xxl + 6,
    fontWeight: typography.weights.bold,
    color: colors.textInverse,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    marginBottom: spacing.xxxl + spacing.xl,
    lineHeight: 24,
  },
  btn: {
    ...components.buttonPrimary,
    width: "100%",
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
  },
  btnText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.brandBlue,
  },
  link: {
    color: "rgba(255,255,255,0.85)",
    fontSize: typography.sizes.sm,
    textAlign: "center",
  },
});