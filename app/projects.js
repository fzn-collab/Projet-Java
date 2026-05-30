import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = 'http://192.168.8.24:8084';

export default function ProjectsScreen() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/projects`);
      if (!response.ok) {
        throw new Error(`Erreur serveur (${response.status})`);
      }
      const data = await response.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.message?.includes('Network')
          ? 'Impossible de joindre le serveur. Vérifiez votre connexion réseau.'
          : err.message || 'Erreur lors du chargement des projets.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProjects();
    }, [fetchProjects])
  );

  const deleteProject = (id) => {
    Alert.alert('Supprimer', 'Tu veux vraiment supprimer ce projet ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await fetch(`${API_URL}/api/projects/${id}`, {
              method: 'DELETE',
            });
            if (!response.ok) {
              throw new Error(`Erreur serveur (${response.status})`);
            }
            fetchProjects();
          } catch (err) {
            Alert.alert(
              'Erreur',
              err.message?.includes('Network')
                ? 'Impossible de joindre le serveur.'
                : 'La suppression a échoué.'
            );
          }
        },
      },
    ]);
  };

  const openEditForm = (project) => {
    router.push({
      pathname: '/project-form',
      params: { project: JSON.stringify(project) },
    });
  };

  if (loading && projects.length === 0 && !error) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/project-form')}
      >
        <Text style={styles.addButtonText}>➕ Nouveau projet</Text>
      </TouchableOpacity>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchProjects}>
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <ScrollView>
        {!error && projects.length === 0 && (
          <Text style={styles.empty}>Aucun projet. Crée ton premier projet !</Text>
        )}
        {projects.map((project) => (
          <View key={project.id} style={styles.card}>
            <Text style={styles.cardTitle}>{project.titre}</Text>
            <Text style={styles.cardSecteur}>🏢 {project.secteur}</Text>
            <Text style={styles.cardBesoin}>🤝 Besoin : {project.besoin}</Text>
            <Text
              style={[
                styles.cardStatut,
                { color: project.statut === 'actif' ? '#4CAF50' : '#999' },
              ]}
            >
              ● {project.statut}
            </Text>
            <View style={styles.cardButtons}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => openEditForm(project)}
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
  loadingText: { marginTop: 12, color: '#666' },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cardSecteur: { color: '#2196F3', marginTop: 6 },
  cardBesoin: { color: '#666', marginTop: 4 },
  cardStatut: { marginTop: 4, fontWeight: 'bold' },
  cardButtons: { flexDirection: 'row', marginTop: 12, gap: 10 },
  editBtn: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
  },
  deleteBtn: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
  errorBox: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: { color: '#c62828', marginBottom: 8 },
  retryButton: { alignSelf: 'flex-start' },
  retryText: { color: '#2196F3', fontWeight: 'bold' },
});
