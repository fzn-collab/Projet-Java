import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity,
         StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { auth, storage } from '../services/authService';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [nom, setNom] = useState('');
  const [secteur, setSecteur] = useState('');
  const [competences, setCompetences] = useState('');
  const [besoin, setBesoin] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const getToken = async () => {
    return await auth.currentUser.getIdToken();
  };

  const loadProfile = async () => {
    try {
      const token = await getToken();
      const response = await axios.get('http://10.0.2.2:8080/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data;
      setProfile(data);
      setNom(data.nom);
      setSecteur(data.secteur);
      setCompetences(data.competences?.join(', '));
      setBesoin(data.besoin);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger le profil');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = await getToken();
      await axios.put('http://10.0.2.2:8080/api/users/me', {
        nom, secteur,
        competences: competences.split(',').map(c => c.trim()),
        besoin
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Succès', 'Profil mis à jour !');
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  const handlePickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      try {
        const uri = result.assets[0].uri;
        const token = await getToken();

        // Upload vers Firebase Storage
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);

        // Envoyer l'URL au backend
        await axios.put('http://10.0.2.2:8080/api/users/me/photo',
          { photoUrl: downloadURL },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProfile(prev => ({ ...prev, photoUrl: downloadURL }));
        Alert.alert('Succès', 'Photo mise à jour !');
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de mettre à jour la photo');
      }
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigation.replace('Login');
  };

  if (loading) return (
    <View style={styles.center}>
      <Text>Chargement...</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mon Profil</Text>

      <TouchableOpacity onPress={handlePickPhoto}>
        {profile?.photoUrl ? (
          <Image
            source={{ uri: profile.photoUrl }}
            style={styles.avatarImage}
          />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {nom ? nom.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
        )}
        <Text style={styles.changePhoto}>Changer la photo</Text>
      </TouchableOpacity>

      <TextInput style={styles.input} placeholder="Nom complet"
        value={nom} onChangeText={setNom}/>

      <TextInput style={styles.input} placeholder="Secteur"
        value={secteur} onChangeText={setSecteur}/>

      <TextInput style={styles.input} placeholder="Compétences (séparées par virgule)"
        value={competences} onChangeText={setCompetences}/>

      <TextInput style={styles.input} placeholder="Besoin"
        value={besoin} onChangeText={setBesoin}/>

      <TouchableOpacity style={styles.btn} onPress={handleUpdate}>
        <Text style={styles.btnText}>Mettre à jour</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
        <Text style={styles.btnText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#6C47FF' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#6C47FF',
            justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 8 },
  avatarImage: { width: 80, height: 80, borderRadius: 40,
                 alignSelf: 'center', marginBottom: 8 },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  changePhoto: { textAlign: 'center', color: '#6C47FF', marginBottom: 24, fontSize: 14 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  btn: { backgroundColor: '#6C47FF', borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 16 },
  btnLogout: { backgroundColor: '#ff4444', borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 16 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});