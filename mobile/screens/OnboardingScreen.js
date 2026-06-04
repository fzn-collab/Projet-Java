import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function OnboardingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🤝</Text>
      <Text style={styles.title}>ConnectEntrepreneurs</Text>
      <Text style={styles.subtitle}>
        La plateforme qui connecte les entrepreneurs, co-fondateurs et investisseurs.
      </Text>

      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.btnText}>Commencer</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center',
               padding: 32, backgroundColor: '#fff' },
  logo: { fontSize: 72, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#6C47FF',
           textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#888', textAlign: 'center',
              marginBottom: 48, lineHeight: 24 },
  btn: { backgroundColor: '#6C47FF', borderRadius: 8, padding: 16,
         width: '100%', alignItems: 'center', marginBottom: 16 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  link: { color: '#6C47FF', fontSize: 14 },
});