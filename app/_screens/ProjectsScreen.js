import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator, Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const API_URL = 'http://192.168.8.24:8084';

export default function ProjectsScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchProjects);
    return unsubscribe;
  }, [navigation]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects`);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.log('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    Alert.alert('Supprimer', 'Tu veux vraiment supprimer ce projet ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer', style: 'destructive',
        onPress: async () => {
          await fetch(`${API_URL}/api/projects/${id}`, { method: 'DELETE' });
          fetchProjects();
        }
      }
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('ProjectForm', { project: null })}
      >
        <Text style={styles.addButtonText}>➕ Nouveau projet</Text>
      </TouchableOpacity>

      <ScrollView>
        {projects.length === 0 && (
          <Text style={styles.empty}>Aucun projet. Crée ton premier projet !</Text>
        )}
        {projects.map((project) => (
          <View key={project.id} style={styles.card}>
            <Text style={styles.cardTitle}>{project.titre}</Text>
            <Text style={styles.cardSecteur}>🏢 {project.secteur}</Text>
            <Text style={styles.cardBesoin}>🤝 Besoin : {project.besoin}</Text>
            <Text style={[styles.cardStatut,
              { color: project.statut === 'actif' ? '#4CAF50' : '#999' }]}>
              ● {project.statut}
            </Text>
            <View style={styles.cardButtons}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => navigation.navigate('ProjectForm', { project })}
              >
                <Text style={styles.btnText}>✏️ Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => deleteProject(project.id)}
              >
                <Text style={styles.btnText}>🗑️ Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  addButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 16 },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cardSecteur: { color: '#2196F3', marginTop: 6 },
  cardBesoin: { color: '#666', marginTop: 4 },
  cardStatut: { marginTop: 4, fontWeight: 'bold' },
  cardButtons: { flexDirection: 'row', marginTop: 12, gap: 10 },
  editBtn: { backgroundColor: '#2196F3', padding: 8, borderRadius: 8, flex: 1, alignItems: 'center' },
  deleteBtn: { backgroundColor: '#f44336', padding: 8, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
});