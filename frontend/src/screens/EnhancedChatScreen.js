import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import socketService from '../services/socketService';
import { apiService } from '../services/apiService';
import EnhancedMessageBubble from '../components/EnhancedMessageBubble';
import TypingIndicator from '../components/TypingIndicator';

const EnhancedChatScreen = ({ username, onLogout, theme, isDarkMode, toggleTheme }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    initializeChat();
    return () => {
      socketService.disconnect();
    };
  }, []);

  const initializeChat = async () => {
    try {
      setConnectionStatus('connecting');

      // Connect to socket with timeout
      const connectPromise = socketService.connect();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout')), 10000)
      );

      await Promise.race([connectPromise, timeoutPromise]);

      socketService.login(username);
      setConnectionStatus('connected');

      // Load chat history
      try {
        const response = await apiService.getChatHistory();
        if (response.success) {
          setMessages(response.data);
        }
      } catch (error) {
        console.log('Could not load chat history:', error);
      }

      // Setup socket listeners
      setupSocketListeners();

      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing chat:', error);
      setConnectionStatus('failed');
      Alert.alert(
        'Connection Error',
        'Failed to connect to chat server. Please check:\n\n' +
        '1. Backend server is running\n' +
        '2. Server URL is correct in config\n' +
        '3. Internet connection is active\n\n' +
        'Tap OK to retry or Logout to exit.',
        [
          { text: 'Logout', onPress: onLogout, style: 'cancel' },
          { text: 'Retry', onPress: initializeChat }
        ]
      );
      setIsLoading(false);
    }
  };

  const setupSocketListeners = () => {
    socketService.onMessageReceive((message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();

      // Auto-mark as delivered if it's not our message
      if (message.username !== username) {
        setTimeout(() => {
          socketService.markAsDelivered(message._id);
        }, 500);
      }
    });

    socketService.onUserJoined(({ username: joinedUser, onlineUsers }) => {
      setOnlineUsers(onlineUsers);
    });

    socketService.onUserLeft(({ username: leftUser, onlineUsers }) => {
      setOnlineUsers(onlineUsers);
    });

    socketService.onUsersOnline((users) => {
      setOnlineUsers(users);
    });

    socketService.onUserTyping((typingUsername) => {
      setTypingUser(typingUsername);
    });

    socketService.onUserStoppedTyping((typingUsername) => {
      if (typingUser === typingUsername) {
        setTypingUser(null);
      }
    });

    socketService.onMessageStatusUpdate(({ messageId, status }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, status } : msg
        )
      );
    });
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isSending) return;

    if (connectionStatus !== 'connected') {
      Alert.alert('Connection Error', 'Not connected to server. Please retry connection.');
      return;
    }

    setIsSending(true);
    socketService.sendMessage(username, inputMessage.trim());
    setInputMessage('');
    socketService.stopTyping(username);
    setIsSending(false);
    scrollToBottom();
  };

  const handleTyping = (text) => {
    setInputMessage(text);

    if (connectionStatus === 'connected') {
      if (text.trim()) {
        socketService.startTyping(username);

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          socketService.stopTyping(username);
        }, 2000);
      } else {
        socketService.stopTyping(username);
      }
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('username');
          socketService.disconnect();
          onLogout();
        },
      },
    ]);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }) => (
    <EnhancedMessageBubble
      message={item.message}
      username={item.username}
      timestamp={item.timestamp}
      status={item.status}
      isOwnMessage={item.username === username}
      theme={theme}
    />
  );

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return theme.success;
      case 'connecting': return theme.warning;
      case 'failed': return theme.error;
      default: return theme.textSecondary;
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>
          Connecting to chat...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.headerBg }]}>
        <View style={styles.headerLeft}>
          <View>
            <Text style={[styles.headerTitle, { color: theme.headerText }]}>
              Chat Room
            </Text>
            <View style={styles.headerSubtitleContainer}>
              <View style={[styles.statusDot, { backgroundColor: getConnectionStatusColor() }]} />
              <Text style={[styles.headerSubtitle, { color: theme.headerText }]}>
                {onlineUsers.length} online • {connectionStatus}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
            <Text style={styles.iconText}>{isDarkMode ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={[styles.logoutText, { color: theme.headerText }]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => item._id || index.toString()}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={scrollToBottom}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No messages yet. Start the conversation! 💬
            </Text>
          </View>
        }
      />

      {/* Typing Indicator */}
      {typingUser && typingUser !== username && (
        <TypingIndicator username={typingUser} theme={theme} />
      )}

      {/* Input Area */}
      <View style={[styles.inputContainer, {
        backgroundColor: theme.surface,
        borderTopColor: theme.border
      }]}>
        <TextInput
          style={[styles.input, {
            backgroundColor: theme.inputBg,
            color: theme.text
          }]}
          placeholder="Type a message..."
          placeholderTextColor={theme.placeholder}
          value={inputMessage}
          onChangeText={handleTyping}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: theme.primary },
            (!inputMessage.trim() || isSending) && styles.sendButtonDisabled,
          ]}
          onPress={handleSendMessage}
          disabled={!inputMessage.trim() || isSending || connectionStatus !== 'connected'}
        >
          <Text style={styles.sendButtonText}>
            {isSending ? '...' : '➤'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  headerSubtitle: {
    fontSize: 12,
    opacity: 0.9,
  },
  iconButton: {
    padding: 8,
    marginRight: 8,
  },
  iconText: {
    fontSize: 20,
  },
  logoutButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
  },
  messagesList: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default EnhancedChatScreen;
