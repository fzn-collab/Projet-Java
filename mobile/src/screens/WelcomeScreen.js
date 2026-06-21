import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { colors, components, radius, spacing, typography } from "../theme";

export default function WelcomeScreen({ navigation }) {
  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}
    >
      <Text style={styles.logo}>Connecto</Text>

      <Text style={styles.slogan}>Where Ideas Meet Opportunity</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    padding: spacing.xxxl - 2,
  },
  logo: {
    fontSize: typography.sizes.hero + 12,
    fontWeight: typography.weights.bold,
    color: colors.textInverse,
  },
  slogan: {
    fontSize: typography.sizes.xxl - 2,
    textAlign: "center",
    color: colors.brandBluePale,
    fontWeight: typography.weights.semibold,
  },
  button: {
    ...components.buttonPrimary,
    width: 250,
    height: 60,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  buttonText: {
    fontSize: typography.sizes.xl - 2,
    fontWeight: typography.weights.semibold,
    color: colors.brandBlue,
  },
});
