import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';

const MessageBubble = ({ message, username, timestamp, status, isOwnMessage }) => {
  const formatTime = (time) => {
    return moment(time).format('HH:mm');
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓';
      default:
        return '';
    }
  };

  return (
    <View
      style={[
        styles.container,
        isOwnMessage ? styles.ownMessage : styles.otherMessage,
      ]}
    >
      {!isOwnMessage && <Text style={styles.username}>{username}</Text>}
      <Text style={styles.message}>{message}</Text>
      <View style={styles.footer}>
        <Text style={styles.time}>{formatTime(timestamp)}</Text>
        {isOwnMessage && (
          <Text style={[styles.status, status === 'read' && styles.statusRead]}>
            {getStatusIcon()}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2196F3',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  username: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  message: {
    fontSize: 16,
    color: '#333',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  time: {
    fontSize: 10,
    color: '#999',
    marginRight: 4,
  },
  status: {
    fontSize: 10,
    color: '#999',
  },
  statusRead: {
    color: '#4CAF50',
  },
});

export default MessageBubble;
