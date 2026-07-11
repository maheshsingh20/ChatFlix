import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import socketService from '../services/socketService';
import { apiService } from '../services/apiService';
import EnhancedMessageBubble from '../components/EnhancedMessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import UserAvatar from '../components/UserAvatar';

const ChatRoomScreen = ({ route, user, token, theme, isDarkMode }) => {
  const { room } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    loadMessages();
    connectSocket();

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      socketService.leaveRoom(room._id);
      socketService.off('message:new', handleNewMessage);
      socketService.off('typing:start', handleTypingStart);
      socketService.off('typing:stop', handleTypingStop);
    };
  }, []);

  const connectSocket = async () => {
    try {
      await socketService.connect();
      socketService.joinRoom(room._id, user.id);
      socketService.on('message:new', handleNewMessage);
      socketService.on('typing:start', handleTypingStart);
      socketService.on('typing:stop', handleTypingStop);
    } catch (error) {
      console.error('Socket connection error:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await apiService.getRoomMessages(room._id);
      if (response.success) {
        setMessages(response.messages);
        setTimeout(() => scrollToBottom(), 200);
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

  const handleTypingStart = ({ userId, username }) => {
    if (userId !== user.id) {
      setTypingUsers((prev) => [...new Set([...prev, username])]);
    }
  };

  const handleTypingStop = ({ userId }) => {
    setTypingUsers((prev) => prev.filter(u => u !== userId));
  };

  const handleTextChange = (text) => {
    setInputMessage(text);

    if (text.trim()) {
      socketService.startTyping(room._id, user.id);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketService.stopTyping(room._id, user.id);
      }, 3000);
    } else {
      socketService.stopTyping(room._id, user.id);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    socketService.stopTyping(room._id, user.id);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    socketService.sendMessage(room._id, user.id, inputMessage.trim());
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
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: theme.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <UserAvatar username={room.type === 'group' ? room.name : otherUser?.displayName} size={40} theme={theme} />
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {room.type === 'group' ? room.name : otherUser?.displayName || otherUser?.username}
          </Text>
          {room.type === 'private' && (
            <Text style={[styles.headerSubtitle, { color: otherUser?.isOnline ? theme.online : theme.textSecondary }]}>
              {otherUser?.isOnline ? '🟢 Online' : 'Offline'}
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
        onContentSizeChange={scrollToBottom}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No messages yet</Text>
            <Text style={[styles.emptySubtext, { color: theme.placeholder }]}>Start the conversation!</Text>
          </View>
        }
      />

      {typingUsers.length > 0 && (
        <TypingIndicator username={typingUsers[0]} theme={theme} />
      )}

      <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text }]}
          placeholder="Type a message..."
          placeholderTextColor={theme.placeholder}
          value={inputMessage}
          onChangeText={handleTextChange}
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
  emptyIcon: { fontSize: 80, marginBottom: 15 },
  emptyText: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
  emptySubtext: { fontSize: 14 },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', padding: 10, borderTopWidth: 1 },
  input: { flex: 1, borderRadius: 24, paddingHorizontal: 18, paddingVertical: 10, fontSize: 16, maxHeight: 100, marginRight: 10 },
  sendButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  sendButtonDisabled: { opacity: 0.5 },
  sendButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
});

export default ChatRoomScreen;
