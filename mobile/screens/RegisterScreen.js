import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, 
         StyleSheet, Alert, ScrollView } from 'react-native';
import { registerUser } from '../services/authService';
import { registerUserBackend } from '../services/userService';

export default function RegisterScreen({ navigation }) {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [secteur, setSecteur] = useState('');
  const [competences, setCompetences] = useState('');
  const [besoin, setBesoin] = useState('');

  const handleRegister = async () => {
    try {
      const userCredential = await registerUser(email, password);

      await registerUserBackend({
        nom,
        email,
        role,
        secteur,
        competences: competences.split(',').map(c => c.trim()),
        besoin,
        firebaseUid: userCredential.user.uid
      });

      navigation.replace('CompleteProfile');
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>
      <Text style={styles.subtitle}>Rejoignez ConnectEntrepreneurs</Text>

      <TextInput style={styles.input} placeholder="Nom complet"
        value={nom} onChangeText={setNom}/>

      <TextInput style={styles.input} placeholder="Email"
        value={email} onChangeText={setEmail}
        keyboardType="email-address" autoCapitalize="none"/>

      <TextInput style={styles.input} placeholder="Mot de passe"
        value={password} onChangeText={setPassword} secureTextEntry/>

      <TextInput style={styles.input} placeholder="Role (ex: USER, ENTREPRENEUR, INVESTOR)"
        value={role} onChangeText={setRole} autoCapitalize="characters"/>

      <TextInput style={styles.input} placeholder="Secteur (ex: FinTech, EdTech...)"
        value={secteur} onChangeText={setSecteur}/>

      <TextInput style={styles.input} placeholder="Compétences (séparées par virgule)"
        value={competences} onChangeText={setCompetences}/>

      <TextInput style={styles.input} placeholder="Besoin (co-fondateur, investisseur...)"
        value={besoin} onChangeText={setBesoin}/>

      <TouchableOpacity style={styles.btn} onPress={handleRegister}>
        <Text style={styles.btnText}>S'inscrire</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8, textAlign: 'center', color: '#6C47FF' },
  subtitle: { fontSize: 16, marginBottom: 32, textAlign: 'center', color: '#888' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  btn: { backgroundColor: '#6C47FF', borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 16 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  link: { textAlign: 'center', marginTop: 8, color: '#6C47FF', fontSize: 14 },
});