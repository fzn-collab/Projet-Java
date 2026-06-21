import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { colors, components, spacing, typography } from "../theme";

export default function ProjectForm({ values, onChange, isEdit = false }) {
  const set = (key, value) => onChange({ ...values, [key]: value });

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.preview}>
        <Text style={styles.previewEmoji}>🚀</Text>
        <Text style={styles.previewText}>
          {values.titre.trim() || "Votre nouveau projet"}
        </Text>
      </View>

      <Text style={styles.label}>Nom du projet *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: FinTrack"
        placeholderTextColor={colors.textMuted}
        value={values.titre}
        onChangeText={(text) => set("titre", text)}
      />

      <Text style={styles.label}>Description *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Décrivez votre projet, votre vision, vos objectifs..."
        placeholderTextColor={colors.textMuted}
        value={values.description}
        onChangeText={(text) => set("description", text)}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Secteur</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: FinTech, EdTech..."
        placeholderTextColor={colors.textMuted}
        value={values.secteur}
        onChangeText={(text) => set("secteur", text)}
      />

      <Text style={styles.label}>Besoin / rôle recherché</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Co-fondateur technique"
        placeholderTextColor={colors.textMuted}
        value={values.besoin}
        onChangeText={(text) => set("besoin", text)}
      />

      <Text style={styles.label}>Compétences recherchées *</Text>
      <TextInput
        style={styles.input}
        placeholder="React, Node.js, UI/UX (séparées par virgule)"
        placeholderTextColor={colors.textMuted}
        value={values.tagsText}
        onChangeText={(text) => set("tagsText", text)}
      />

      {isEdit ? (
        <>
          <Text style={styles.label}>Statut</Text>
          <View style={styles.statusRow}>
            {["actif", "inactif"].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusChip,
                  values.statut === status && styles.statusChipActive,
                ]}
                onPress={() => set("statut", status)}
              >
                <Text
                  style={[
                    components.badgeSkillText,
                    values.statut === status && { color: colors.textInverse },
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : null}
    </ScrollView>
  );
}

export function parseTagsText(tagsText) {
  return tagsText
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function tagsToText(tags) {
  return Array.isArray(tags) ? tags.join(", ") : "";
}

export const emptyProjectForm = {
  titre: "",
  description: "",
  secteur: "",
  besoin: "",
  tagsText: "",
  statut: "actif",
};

export function projectToForm(project) {
  return {
    titre: project.titre || "",
    description: project.description || "",
    secteur: project.secteur || "",
    besoin: project.besoin || "",
    tagsText: tagsToText(project.tags),
    statut: project.statut || "actif",
  };
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  preview: {
    height: 120,
    borderRadius: 16,
    backgroundColor: colors.primaryNavy,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  previewEmoji: {
    fontSize: 36,
  },
  previewText: {
    color: colors.textInverse,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    textAlign: "center",
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
  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  statusRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  statusChip: {
    ...components.badgeSkill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  statusChipActive: {
    backgroundColor: colors.accentBlue,
  },
});
