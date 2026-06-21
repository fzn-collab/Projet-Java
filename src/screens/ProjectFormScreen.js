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
import { auth } from "../services/authService";
import { colors, components, layout, radius, spacing, typography } from "../theme";

const API_URL = "http://10.130.182.153:8080";

export default function ProjectFormScreen({ navigation, route }) {
  const existingProject = route.params?.project;

  const [titre, setTitre] = useState(existingProject?.titre || "");
  const [secteur, setSecteur] = useState(existingProject?.secteur || "");
  const [description, setDescription] = useState(
    existingProject?.description || "",
  );
  const [besoin, setBesoin] = useState(existingProject?.besoin || "");

  const saveProject = async () => {
    if (!titre || !secteur || !besoin) {
      Alert.alert("Erreur", "Remplis tous les champs obligatoires !");
      return;
    }

    const ownerId = auth.currentUser?.uid;
    if (!ownerId) {
      Alert.alert("Erreur", "Vous devez être connecté.");
      return;
    }

    const projectData = {
      titre,
      secteur,
      description,
      besoin,
      ownerId,
      statut: "actif",
    };

    try {
      if (existingProject) {
        await fetch(`${API_URL}/api/projects/${existingProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData),
        });
        Alert.alert("Succès", "Projet modifié !");
      } else {
        await fetch(`${API_URL}/api/projects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData),
        });
        Alert.alert("Succès", "Projet créé !");
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erreur", "Problème de connexion au serveur");
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={existingProject ? "Modifier le projet" : "Nouveau projet"}
        subtitle="Décrivez votre idée"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Titre *</Text>
        <TextInput
          style={styles.input}
          value={titre}
          onChangeText={setTitre}
          placeholder="Ex: SaaS RH"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={styles.label}>Secteur *</Text>
        <TextInput
          style={styles.input}
          value={secteur}
          onChangeText={setSecteur}
          placeholder="Ex: FinTech, HR Tech, EdTech..."
          placeholderTextColor={colors.textMuted}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Décris ton projet..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Besoin *</Text>
        <TextInput
          style={styles.input}
          value={besoin}
          onChangeText={setBesoin}
          placeholder="Ex: Co-fondateur, Marketing Partner..."
          placeholderTextColor={colors.textMuted}
        />

        <TouchableOpacity style={styles.saveButton} onPress={saveProject}>
          <Text style={styles.saveButtonText}>
            {existingProject ? "Modifier" : "Créer le projet"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: layout.screen,
  content: {
    padding: spacing.lg,
    paddingTop: spacing.md,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    ...components.input,
    marginBottom: spacing.lg,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    ...components.buttonPrimary,
    borderRadius: radius.lg - 2,
    marginBottom: spacing.sm + 2,
  },
  saveButtonText: components.buttonPrimaryText,
  cancelButton: {
    ...components.buttonSecondary,
    borderRadius: radius.lg - 2,
  },
  cancelButtonText: components.buttonSecondaryText,
});
