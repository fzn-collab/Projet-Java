import { ScrollView, StyleSheet, Text, TextInput } from "react-native";

import { colors, components, spacing, typography } from "../theme";

export function parseCompetencesText(text) {
  return text
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function competencesToText(competences) {
  return Array.isArray(competences) ? competences.join(", ") : "";
}

export const emptyProfileForm = {
  nom: "",
  secteur: "",
  besoin: "",
  competencesText: "",
  ville: "",
  pays: "",
};

export function profileToForm(profile) {
  return {
    nom: profile?.nom || "",
    secteur: profile?.secteur || "",
    besoin: profile?.besoin || "",
    competencesText: competencesToText(profile?.competences),
    ville: profile?.localisation?.ville || "",
    pays: profile?.localisation?.pays || "",
  };
}

export default function ProfileForm({ values, onChange, email }) {
  const set = (key, value) => onChange({ ...values, [key]: value });

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {email ? (
        <>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.emailValue}>{email}</Text>
        </>
      ) : null}

      <Text style={styles.label}>Nom complet *</Text>
      <TextInput
        style={styles.input}
        placeholder="Votre nom"
        placeholderTextColor={colors.textMuted}
        value={values.nom}
        onChangeText={(text) => set("nom", text)}
      />

      <Text style={styles.label}>Secteur</Text>
      <TextInput
        style={styles.input}
        placeholder="FinTech, EdTech, HealthTech..."
        placeholderTextColor={colors.textMuted}
        value={values.secteur}
        onChangeText={(text) => set("secteur", text)}
      />

      <Text style={styles.label}>Ce que vous recherchez</Text>
      <TextInput
        style={styles.input}
        placeholder="Co-fondateur, investisseur, mentor..."
        placeholderTextColor={colors.textMuted}
        value={values.besoin}
        onChangeText={(text) => set("besoin", text)}
      />

      <Text style={styles.label}>Compétences *</Text>
      <TextInput
        style={styles.input}
        placeholder="React, Marketing, Finance..."
        placeholderTextColor={colors.textMuted}
        value={values.competencesText}
        onChangeText={(text) => set("competencesText", text)}
      />

      <Text style={styles.label}>Ville</Text>
      <TextInput
        style={styles.input}
        placeholder="Casablanca"
        placeholderTextColor={colors.textMuted}
        value={values.ville}
        onChangeText={(text) => set("ville", text)}
      />

      <Text style={styles.label}>Pays</Text>
      <TextInput
        style={styles.input}
        placeholder="Maroc"
        placeholderTextColor={colors.textMuted}
        value={values.pays}
        onChangeText={(text) => set("pays", text)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  input: {
    ...components.input,
  },
  emailValue: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
});
