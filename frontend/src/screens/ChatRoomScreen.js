import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import socketService from '../services/socketService';
import axios from 'axios';
import { API_URL } from '../utils/config';
import EnhancedMessageBubble from '../components/EnhancedMessageBubble';
import UserAvatar from '../components/UserAvatar';

const ChatRoomScreen = ({ route, user, token, theme, isDarkMode }) => {
  const { room } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadMessages();
    socketService.connect().then(() => {
      socketService.socket.emit('join:room', { roomId: room._id, userId: user.id });
      socketService.socket.on('message:new', handleNewMessage);
    });

    return () => {
      socketService.socket.emit('leave:room', room._id);
      socketService.socket.off('message:new');
    };
  }, []);

  const loadMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/chats/rooms/${room._id}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Load messages error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (message) => {
    setMessages((prev) => [...prev, message]);
    scrollToBottom();
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    socketService.socket.emit('message:send', {
      roomId: room._id,
      senderId: user.id,
      message: inputMessage.trim(),
    });

    setInputMessage('');
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item }) => (
    <EnhancedMessageBubble
      message={item.message}
      username={item.sender?.displayName || item.sender?.username}
      timestamp={item.timestamp}
      status={item.status}
      isOwnMessage={item.sender?._id === user.id}
      theme={theme}
    />
  );

  const otherUser = room.type === 'private' ? room.participants.find(p => p._id !== user.id) : null;

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: theme.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <UserAvatar username={room.type === 'group' ? room.name : otherUser?.displayName} size={40} theme={theme} />
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {room.type === 'group' ? room.name : otherUser?.displayName || otherUser?.username}
          </Text>
          {room.type === 'private' && (
            <Text style={[styles.headerSubtitle, { color: otherUser?.isOnline ? theme.online : theme.textSecondary }]}>
              {otherUser?.isOnline ? 'Online' : 'Offline'}
            </Text>
          )}
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.messagesList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No messages yet. Start the conversation!</Text>
          </View>
        }
      />

      <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text }]}
          placeholder="Type a message..."
          placeholderTextColor={theme.placeholder}
          value={inputMessage}
          onChangeText={setInputMessage}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: theme.primary }, !inputMessage.trim() && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!inputMessage.trim()}
        >
          <Text style={styles.sendButtonText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1 },
  headerInfo: { flex: 1, marginLeft: 15 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  headerSubtitle: { fontSize: 12, marginTop: 2 },
  messagesList: { paddingHorizontal: 15, paddingVertical: 10 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 50 },
  emptyText: { fontSize: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', padding: 10, borderTopWidth: 1 },
  input: { flex: 1, borderRadius: 24, paddingHorizontal: 18, paddingVertical: 10, fontSize: 16, maxHeight: 100, marginRight: 10 },
  sendButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  sendButtonDisabled: { opacity: 0.5 },
  sendButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
});

export default ChatRoomScreen;
