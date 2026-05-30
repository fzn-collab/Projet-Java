import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = 'http://192.168.8.24:8084';
const USER_ID = 'user123';

export default function DashboardScreen() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/dashboard/${USER_ID}`);
      if (!response.ok) {
        throw new Error(`Erreur serveur (${response.status})`);
      }
      const data = await response.json();
      setDashboard(data);
    } catch (err) {
      setError(
        err.message?.includes('Network')
          ? 'Impossible de joindre le serveur. Vérifiez votre connexion et que le backend tourne sur le port 8084.'
          : err.message || 'Erreur lors du chargement du dashboard.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading && !dashboard) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (error && !dashboard) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchDashboard()}>
          <Text style={styles.buttonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => fetchDashboard(true)}
          colors={['#4CAF50']}
        />
      }
    >
      <Text style={styles.title}>🚀 Mon Dashboard</Text>

      {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{dashboard?.totalProjets ?? 0}</Text>
          <Text style={styles.statLabel}>Total Projets</Text>
        </View>
        <View style={[styles.statCard, styles.statCardBlue]}>
          <Text style={[styles.statNumber, styles.statNumberBlue]}>
            {dashboard?.projetsActifs ?? 0}
          </Text>
          <Text style={styles.statLabel}>Projets Actifs</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/projects')}>
        <Text style={styles.buttonText}>📋 Voir mes projets</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonGreen]}
        onPress={() => router.push('/project-form')}
      >
        <Text style={styles.buttonText}>➕ Créer un projet</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Projets récents</Text>
      {!dashboard?.projetsRecents?.length ? (
        <Text style={styles.empty}>Aucun projet pour le moment</Text>
      ) : (
        dashboard.projetsRecents.map((project) => (
          <View key={project.id} style={styles.projectCard}>
            <Text style={styles.projectTitle}>{project.titre}</Text>
            <Text style={styles.projectSecteur}>{project.secteur}</Text>
            <Text style={styles.projectBesoin}>Besoin : {project.besoin}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 12, color: '#666' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, gap: 12 },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCardBlue: { borderTopWidth: 3, borderTopColor: '#2196F3' },
  statNumber: { fontSize: 32, fontWeight: 'bold', color: '#4CAF50' },
  statNumberBlue: { color: '#2196F3' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4, textAlign: 'center' },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 25,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonGreen: { backgroundColor: '#4CAF50', shadowColor: '#4CAF50' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  empty: { color: '#999', textAlign: 'center', marginTop: 20 },
  projectCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  projectTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  projectSecteur: { color: '#2196F3', marginTop: 4 },
  projectBesoin: { color: '#666', marginTop: 4 },
  errorText: { color: '#c62828', textAlign: 'center', marginBottom: 16, lineHeight: 22 },
  errorBanner: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
});
