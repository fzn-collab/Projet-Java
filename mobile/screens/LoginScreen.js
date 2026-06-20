import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { loginUser } from '../services/authService';
import { loginWithGoogleIdToken } from '../services/authService';
import { syncFirebaseUser } from '../services/userService';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type !== 'success') return;

      const idToken = response.authentication?.idToken;
      if (!idToken) {
        Alert.alert('Erreur', 'Google idToken manquant.');
        return;
      }

      try {
        const credential = await loginWithGoogleIdToken(idToken);
        await syncFirebaseUser({
          email: credential.user?.email,
          nom: credential.user?.displayName,
          photoUrl: credential.user?.photoURL,
        });
        navigation.replace('CompleteProfile');
      } catch (error) {
        Alert.alert('Erreur', error.message);
      }
    };

    handleGoogleResponse();
  }, [response, navigation]);

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      navigation.replace('CompleteProfile');
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ConnectEntrepreneurs</Text>
      <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>

      <TextInput style={styles.input} placeholder="Email"
        value={email} onChangeText={setEmail} keyboardType="email-address"
        autoCapitalize="none"/>

      <TextInput style={styles.input} placeholder="Mot de passe"
        value={password} onChangeText={setPassword} secureTextEntry/>

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnGoogle}
        onPress={() => {
          if (!request) {
            Alert.alert('Configuration requise', 'Google Sign-In n est pas configure.');
            return;
          }
          promptAsync();
        }}
      >
        <Text style={styles.btnGoogleText}>Continuer avec Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Pas de compte ? S'inscrire</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.link}>Mot de passe oublié ?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8, textAlign: 'center', color: '#6C47FF' },
  subtitle: { fontSize: 16, marginBottom: 32, textAlign: 'center', color: '#888' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  btn: { backgroundColor: '#6C47FF', borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 16 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  btnGoogle: { backgroundColor: '#fff', borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#ccc' },
  btnGoogleText: { color: '#222', fontWeight: '600', fontSize: 16 },
  link: { textAlign: 'center', marginTop: 8, color: '#6C47FF', fontSize: 14 },
});