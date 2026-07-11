import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_URL } from '../utils/config';
import UserAvatar from '../components/UserAvatar';

const ContactsScreen = ({ user, token, navigation, theme }) => {
  const [contacts, setContacts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setContacts(response.data.contacts);
      }
    } catch (error) {
      console.error('Load contacts error:', error);
    }
  };

  const searchUsers = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/users/search?query=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setSearchResults(response.data.users);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const startChat = async (contact) => {
    try {
      const response = await axios.get(`${API_URL}/api/chats/rooms/private/${contact._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        navigation.navigate('Chat', { room: response.data.room });
      }
    } catch (error) {
      console.error('Start chat error:', error);
    }
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity style={[styles.userItem, { backgroundColor: theme.surface, borderBottomColor: theme.border }]} onPress={() => startChat(item)}>
      <UserAvatar username={item.displayName || item.username} size={50} theme={theme} />
      <View style={styles.userInfo}>
        <Text style={[styles.userName, { color: theme.text }]}>{item.displayName || item.username}</Text>
        <Text style={[styles.userStatus, { color: item.isOnline ? theme.online : theme.textSecondary }]}>
          {item.isOnline ? 'Online' : 'Offline'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme.inputBg, color: theme.text }]}
          placeholder="Search users..."
          placeholderTextColor={theme.placeholder}
          value={searchQuery}
          onChangeText={searchUsers}
        />
      </View>
      {loading && <ActivityIndicator style={styles.loader} color={theme.primary} />}
      <FlatList
        data={searchQuery ? searchResults : contacts}
        renderItem={renderUser}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              {searchQuery ? 'No users found' : 'No contacts yet. Search to add!'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: { padding: 15, borderBottomWidth: 1 },
  searchInput: { height: 45, borderRadius: 8, paddingHorizontal: 15, fontSize: 16 },
  loader: { marginVertical: 20 },
  userItem: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, alignItems: 'center' },
  userInfo: { flex: 1, marginLeft: 15 },
  userName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  userStatus: { fontSize: 14 },
  emptyContainer: { paddingVertical: 50, alignItems: 'center' },
  emptyText: { fontSize: 16 },
});

export default ContactsScreen;
