import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text, TextInput,
    TouchableOpacity
} from 'react-native';

const API_URL = 'http://192.168.8.24:8084';

export default function ProjectFormScreen({ navigation, route }) {
  const existingProject = route.params?.project;

  const [titre, setTitre] = useState(existingProject?.titre || '');
  const [secteur, setSecteur] = useState(existingProject?.secteur || '');
  const [description, setDescription] = useState(existingProject?.description || '');
  const [besoin, setBesoin] = useState(existingProject?.besoin || '');

  const saveProject = async () => {
    if (!titre || !secteur || !besoin) {
      Alert.alert('Erreur', 'Remplis tous les champs obligatoires !');
      return;
    }

    const projectData = {
      titre, secteur, description, besoin,
      ownerId: 'user123',
      statut: 'actif'
    };

    try {
      if (existingProject) {
        await fetch(`${API_URL}/api/projects/${existingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        });
        Alert.alert('✅ Succès', 'Projet modifié !');
      } else {
        await fetch(`${API_URL}/api/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        });
        Alert.alert('✅ Succès', 'Projet créé !');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', 'Problème de connexion au serveur');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {existingProject ? '✏️ Modifier le projet' : '➕ Nouveau projet'}
      </Text>

      <Text style={styles.label}>Titre *</Text>
      <TextInput
        style={styles.input}
        value={titre}
        onChangeText={setTitre}
        placeholder="Ex: SaaS RH"
      />

      <Text style={styles.label}>Secteur *</Text>
      <TextInput
        style={styles.input}
        value={secteur}
        onChangeText={setSecteur}
        placeholder="Ex: FinTech, HR Tech, EdTech..."
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Décris ton projet..."
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Besoin *</Text>
      <TextInput
        style={styles.input}
        value={besoin}
        onChangeText={setBesoin}
        placeholder="Ex: Co-fondateur, Marketing Partner..."
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveProject}>
        <Text style={styles.saveButtonText}>
          {existingProject ? '💾 Modifier' : '🚀 Créer le projet'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelButtonText}>Annuler</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, color: '#333' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 6 },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  textArea: { height: 100, textAlignVertical: 'top' },
  saveButton: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  cancelButton: { backgroundColor: '#ddd', padding: 14, borderRadius: 10, alignItems: 'center' },
  cancelButtonText: { color: '#555', fontSize: 16 },
});