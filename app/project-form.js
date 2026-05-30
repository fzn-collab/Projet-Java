import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = 'http://192.168.8.24:8084';

function parseProjectParam(projectParam) {
  if (!projectParam || projectParam === 'null' || projectParam === 'undefined') {
    return null;
  }
  try {
    return typeof projectParam === 'string' ? JSON.parse(projectParam) : projectParam;
  } catch {
    return null;
  }
}

export default function ProjectFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const existingProject = useMemo(
    () => parseProjectParam(params.project),
    [params.project]
  );

  const [titre, setTitre] = useState(existingProject?.titre ?? '');
  const [secteur, setSecteur] = useState(existingProject?.secteur ?? '');
  const [description, setDescription] = useState(existingProject?.description ?? '');
  const [besoin, setBesoin] = useState(existingProject?.besoin ?? '');
  const [saving, setSaving] = useState(false);

  const saveProject = async () => {
    if (!titre.trim() || !secteur.trim() || !besoin.trim()) {
      Alert.alert('Erreur', 'Titre, secteur et besoin sont obligatoires.');
      return;
    }

    const projectData = {
      titre: titre.trim(),
      secteur: secteur.trim(),
      description: description.trim(),
      besoin: besoin.trim(),
      ownerId: 'user123',
      statut: existingProject?.statut ?? 'actif',
    };

    setSaving(true);

    try {
      const url = existingProject
        ? `${API_URL}/api/projects/${existingProject.id}`
        : `${API_URL}/api/projects`;
      const method = existingProject ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur (${response.status})`);
      }

      Alert.alert(
        'Succès',
        existingProject ? 'Projet modifié !' : 'Projet créé !',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (err) {
      Alert.alert(
        'Erreur',
        err.message?.includes('Network')
          ? 'Impossible de joindre le serveur. Vérifiez votre connexion réseau.'
          : 'La sauvegarde a échoué.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>
        {existingProject ? '✏️ Modifier le projet' : '➕ Nouveau projet'}
      </Text>

      <Text style={styles.label}>Titre *</Text>
      <TextInput
        style={styles.input}
        value={titre}
        onChangeText={setTitre}
        placeholder="Ex: SaaS RH"
        editable={!saving}
      />

      <Text style={styles.label}>Secteur *</Text>
      <TextInput
        style={styles.input}
        value={secteur}
        onChangeText={setSecteur}
        placeholder="Ex: FinTech, HR Tech, EdTech..."
        editable={!saving}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Décris ton projet..."
        multiline
        numberOfLines={4}
        editable={!saving}
      />

      <Text style={styles.label}>Besoin *</Text>
      <TextInput
        style={styles.input}
        value={besoin}
        onChangeText={setBesoin}
        placeholder="Ex: Co-fondateur, Marketing Partner..."
        editable={!saving}
      />

      <TouchableOpacity
        style={[styles.saveButton, saving && styles.buttonDisabled]}
        onPress={saveProject}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>
            {existingProject ? '💾 Modifier' : '🚀 Créer le projet'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
        disabled={saving}
      >
        <Text style={styles.cancelButtonText}>Annuler</Text>
      </TouchableOpacity>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, color: '#333' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: { opacity: 0.7 },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  cancelButton: {
    backgroundColor: '#e0e0e0',
    padding: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  cancelButtonText: { color: '#555', fontSize: 16 },
});
