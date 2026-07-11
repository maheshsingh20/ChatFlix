import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { apiService } from '../services/apiService';
import UserAvatar from '../components/UserAvatar';

const ContactsScreen = ({ user, token, navigation, theme }) => {
  const [contacts, setContacts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const response = await apiService.getContacts();
      if (response.success) {
        setContacts(response.contacts);
      }
    } catch (error) {
      console.error('Load contacts error:', error);
      Alert.alert('Error', 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    try {
      const response = await apiService.searchUsers(query);
      if (response.success) {
        // Filter out current user
        const filteredUsers = response.users.filter(u => u._id !== user.id);
        setSearchResults(filteredUsers);
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Failed to search users');
    } finally {
      setSearching(false);
    }
  };

  const startChat = async (contact) => {
    try {
      const response = await apiService.getPrivateRoom(contact._id);
      if (response.success) {
        navigation.navigate('Chat', { room: response.room });
      }
    } catch (error) {
      console.error('Start chat error:', error);
      Alert.alert('Error', 'Failed to start chat');
    }
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity
      style={[styles.userItem, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}
      onPress={() => startChat(item)}
      activeOpacity={0.7}
    >
      <UserAvatar username={item.displayName || item.username} size={50} theme={theme} />
      <View style={styles.userInfo}>
        <Text style={[styles.userName, { color: theme.text }]} numberOfLines={1}>
          {item.displayName || item.username}
        </Text>
        <Text style={[styles.userEmail, { color: theme.textSecondary }]} numberOfLines={1}>
          @{item.username}
        </Text>
      </View>
      {item.isOnline && (
        <View style={[styles.onlineBadge, { backgroundColor: theme.online }]} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <View style={[styles.searchInputContainer, { backgroundColor: theme.inputBg }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search users by username or email..."
            placeholderTextColor={theme.placeholder}
            value={searchQuery}
            onChangeText={searchUsers}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => searchUsers('')} style={styles.clearButton}>
              <Text style={[styles.clearText, { color: theme.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {(loading || searching) && (
        <ActivityIndicator style={styles.loader} color={theme.primary} size="large" />
      )}

      <FlatList
        data={searchQuery ? searchResults : contacts}
        renderItem={renderUser}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          !loading && !searching && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>{searchQuery ? '🔍' : '👥'}</Text>
              <Text style={[styles.emptyText, { color: theme.text }]}>
                {searchQuery ? 'No users found' : 'No contacts yet'}
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.placeholder }]}>
                {searchQuery ? 'Try a different search term' : 'Search above to find and add contacts!'}
              </Text>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: { padding: 15, borderBottomWidth: 1 },
  searchInputContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, paddingHorizontal: 12, height: 45 },
  searchIcon: { fontSize: 18, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16 },
  clearButton: { padding: 5 },
  clearText: { fontSize: 18, fontWeight: 'bold' },
  loader: { marginVertical: 20 },
  userItem: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, alignItems: 'center' },
  userInfo: { flex: 1, marginLeft: 15 },
  userName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  userEmail: { fontSize: 14 },
  onlineBadge: { width: 12, height: 12, borderRadius: 6, marginLeft: 10 },
  emptyContainer: { paddingVertical: 80, alignItems: 'center', paddingHorizontal: 40 },
  emptyIcon: { fontSize: 80, marginBottom: 20 },
  emptyText: { fontSize: 18, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
  emptySubtext: { fontSize: 14, textAlign: 'center' },
});

export default ContactsScreen;
