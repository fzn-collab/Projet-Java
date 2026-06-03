import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, SafeAreaView
} from 'react-native';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([
    {
      id: '1', type: 'message', read: false,
      title: 'Nouveau message',
      text: 'entrepreneur2 vous a envoyé un message',
      time: 'Il y a 5 min',
    },
    {
      id: '2', type: 'match', read: false,
      title: 'Nouveau match !',
      text: 'Vous avez matché avec un entrepreneur FinTech',
      time: 'Il y a 1h',
    },
    {
      id: '3', type: 'project', read: true,
      title: 'Invitation projet',
      text: 'Vous êtes invité à rejoindre un projet SaaS RH',
      time: 'Il y a 2h',
    },
    {
      id: '4', type: 'match', read: true,
      title: 'Nouveau match !',
      text: 'Profil compatible dans le secteur E-Commerce',
      time: 'Hier',
    },
  ]);

  const getIcon = (type) => {
    if (type === 'message') return '💬';
    if (type === 'match') return '🤝';
    if (type === 'project') return '📋';
    return '🔔';
  };

  const getColor = (type) => {
    if (type === 'message') return '#1A73E8';
    if (type === 'match') return '#4CAF50';
    if (type === 'project') return '#FF9800';
    return '#9C27B0';
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={styles.headerSubtitle}>{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</Text>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllButton} onPress={markAllRead}>
            <Text style={styles.markAllText}>Tout lire</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>Aucune notification</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.notifItem, !item.read && styles.unreadItem]}
            onPress={() => setNotifications(prev =>
              prev.map(n => n.id === item.id ? { ...n, read: true } : n)
            )}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: getColor(item.type) + '20' }]}>
              <Text style={styles.icon}>{getIcon(item.type)}</Text>
            </View>
            <View style={styles.notifContent}>
              <View style={styles.notifHeader}>
                <Text style={styles.notifTitle}>{item.title}</Text>
                <Text style={styles.notifTime}>{item.time}</Text>
              </View>
              <Text style={styles.notifText}>{item.text}</Text>
            </View>
            {!item.read && <View style={[styles.unreadDot, { backgroundColor: getColor(item.type) }]} />}
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A73E8',
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 4,
  },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: '700' },
  headerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 },
  markAllButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
  },
  markAllText: { color: 'white', fontSize: 13, fontWeight: '600' },

  list: { paddingVertical: 8 },

  // Empty
  emptyContainer: { justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  emptyIcon: { fontSize: 60, marginBottom: 20 },
  emptyTitle: { fontSize: 18, color: '#888' },

  // Notification item
  notifItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  unreadItem: { backgroundColor: '#F0F7FF' },
  iconContainer: {
    width: 48, height: 48, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  icon: { fontSize: 22 },
  notifContent: { flex: 1 },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  notifTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  notifTime: { fontSize: 12, color: '#999' },
  notifText: { fontSize: 14, color: '#555', lineHeight: 20 },
  unreadDot: { width: 10, height: 10, borderRadius: 5, marginLeft: 10 },
  separator: { height: 1, backgroundColor: '#F0F0F0' },
});