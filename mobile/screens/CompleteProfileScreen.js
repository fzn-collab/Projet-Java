import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { updateProfile } from '../services/userService';

export default function CompleteProfileScreen({ navigation }) {
  const [nom, setNom] = useState('');
  const [role, setRole] = useState('USER');
  const [secteur, setSecteur] = useState('');
  const [competences, setCompetences] = useState('');
  const [besoin, setBesoin] = useState('');
  const [ville, setVille] = useState('');
  const [pays, setPays] = useState('');

  const handleSave = async () => {
    if (!nom || !secteur || !competences || !besoin || !ville) {
      Alert.alert('Profil incomplet', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      await updateProfile({
        nom,
        role,
        secteur,
        competences: competences.split(',').map((c) => c.trim()).filter(Boolean),
        besoin,
        localisation: {
          ville,
          pays,
        },
      });

      Alert.alert('Succes', 'Profil complete avec succes.');
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Impossible de sauvegarder le profil.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Completer mon profil</Text>
      <Text style={styles.subtitle}>Ces informations sont necessaires pour le matching.</Text>

      <TextInput style={styles.input} placeholder="Nom complet *" value={nom} onChangeText={setNom} />

      <TextInput
        style={styles.input}
        placeholder="Role (ex: USER, ENTREPRENEUR, INVESTOR)"
        value={role}
        onChangeText={setRole}
        autoCapitalize="characters"
      />

      <TextInput style={styles.input} placeholder="Secteur *" value={secteur} onChangeText={setSecteur} />

      <TextInput
        style={styles.input}
        placeholder="Competences (separees par virgule) *"
        value={competences}
        onChangeText={setCompetences}
      />

      <TextInput style={styles.input} placeholder="Besoin *" value={besoin} onChangeText={setBesoin} />

      <TextInput style={styles.input} placeholder="Ville *" value={ville} onChangeText={setVille} />

      <TextInput style={styles.input} placeholder="Pays" value={pays} onChangeText={setPays} />

      <TouchableOpacity style={styles.btn} onPress={handleSave}>
        <Text style={styles.btnText}>Enregistrer et continuer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#6C47FF',
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 28,
    textAlign: 'center',
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  btn: {
    backgroundColor: '#6C47FF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
