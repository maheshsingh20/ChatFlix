import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_URL } from '../utils/config';
import UserAvatar from '../components/UserAvatar';

const ChatListScreen = ({ user, token, navigation, theme, isDarkMode, toggleTheme, onLogout }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/chats/rooms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setRooms(response.data.rooms);
      }
    } catch (error) {
      console.error('Load rooms error:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={toggleTheme} style={{ padding: 10 }}>
            <Text style={{ fontSize: 20 }}>{isDarkMode ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onLogout} style={{ padding: 10, marginRight: 10 }}>
            <Text style={{ color: theme.headerText, fontSize: 14 }}>Logout</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, isDarkMode]);

  const renderRoom = ({ item }) => {
    const otherUser = item.participants.find(p => p._id !== user.id);
    return (
      <TouchableOpacity style={[styles.roomItem, { backgroundColor: theme.surface, borderBottomColor: theme.border }]} onPress={() => navigation.navigate('Chat', { room: item })}>
        <UserAvatar username={item.type === 'group' ? item.name : otherUser?.displayName} size={50} theme={theme} />
        <View style={styles.roomInfo}>
          <Text style={[styles.roomName, { color: theme.text }]}>
            {item.type === 'group' ? item.name : otherUser?.displayName || otherUser?.username}
          </Text>
          <Text style={[styles.lastMessage, { color: theme.textSecondary }]} numberOfLines={1}>
            Tap to start chatting...
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <FlatList
        data={rooms}
        renderItem={renderRoom}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No chats yet.</Text>
            <Text style={[styles.emptySubtext, { color: theme.placeholder }]}>Tap + to start a new conversation!</Text>
          </View>
        }
      />
      <TouchableOpacity style={[styles.fab, { backgroundColor: theme.primary }]} onPress={() => navigation.navigate('Contacts')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  roomItem: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, alignItems: 'center' },
  roomInfo: { flex: 1, marginLeft: 15 },
  roomName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  lastMessage: { fontSize: 14 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 50 },
  emptyIcon: { fontSize: 80, marginBottom: 20 },
  emptyText: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  emptySubtext: { fontSize: 14 },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
  fabText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
});

export default ChatListScreen;
