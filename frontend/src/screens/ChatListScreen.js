import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator, RefreshControl } from 'react-native';
import { apiService } from '../services/apiService';
import UserAvatar from '../components/UserAvatar';

const ChatListScreen = ({ user, token, navigation, theme, isDarkMode, toggleTheme, onLogout }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const response = await apiService.getRooms();
      if (response.success) {
        setRooms(response.rooms);
      }
    } catch (error) {
      console.error('Load rooms error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadRooms();
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={toggleTheme} style={styles.headerButton}>
            <Text style={{ fontSize: 22 }}>{isDarkMode ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onLogout} style={styles.headerButton}>
            <Text style={[styles.logoutText, { color: theme.error }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, isDarkMode]);

  const renderRoom = ({ item }) => {
    const otherUser = item.type === 'private' ? item.participants.find(p => p._id !== user.id) : null;
    const displayName = item.type === 'group' ? item.name : (otherUser?.displayName || otherUser?.username);

    return (
      <TouchableOpacity
        style={[styles.roomItem, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}
        onPress={() => navigation.navigate('Chat', { room: item })}
        activeOpacity={0.7}
      >
        <UserAvatar username={displayName} size={50} theme={theme} />
        <View style={styles.roomInfo}>
          <View style={styles.roomHeader}>
            <Text style={[styles.roomName, { color: theme.text }]} numberOfLines={1}>
              {displayName}
            </Text>
            {item.type === 'private' && otherUser?.isOnline && (
              <View style={[styles.onlineBadge, { backgroundColor: theme.online }]} />
            )}
          </View>
          <Text style={[styles.lastMessage, { color: theme.textSecondary }]} numberOfLines={1}>
            {item.lastMessage?.message || 'Tap to start chatting...'}
          </Text>
        </View>
        {item.unreadCount > 0 && (
          <View style={[styles.unreadBadge, { backgroundColor: theme.primary }]}>
            <Text style={styles.unreadText}>{item.unreadCount > 99 ? '99+' : item.unreadCount}</Text>
          </View>
        )}
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} tintColor={theme.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={[styles.emptyText, { color: theme.text }]}>No chats yet</Text>
            <Text style={[styles.emptySubtext, { color: theme.placeholder }]}>Tap the + button to start a new conversation!</Text>
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
  headerButton: { padding: 10, marginRight: 5 },
  logoutText: { fontSize: 14, fontWeight: '600' },
  roomItem: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, alignItems: 'center' },
  roomInfo: { flex: 1, marginLeft: 15 },
  roomHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  roomName: { fontSize: 16, fontWeight: '600', flex: 1 },
  onlineBadge: { width: 10, height: 10, borderRadius: 5, marginLeft: 8 },
  lastMessage: { fontSize: 14 },
  unreadBadge: { minWidth: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 },
  unreadText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 80 },
  emptyIcon: { fontSize: 80, marginBottom: 20 },
  emptyText: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  emptySubtext: { fontSize: 14, textAlign: 'center', paddingHorizontal: 40 },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
  fabText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
});

export default ChatListScreen;
