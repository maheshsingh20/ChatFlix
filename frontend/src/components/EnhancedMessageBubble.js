import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';

const EnhancedMessageBubble = ({
  message,
  username,
  timestamp,
  status,
  isOwnMessage,
  theme
}) => {
  const formatTime = (time) => {
    const msgTime = moment(time);
    const now = moment();

    if (now.diff(msgTime, 'days') === 0) {
      return msgTime.format('HH:mm');
    } else if (now.diff(msgTime, 'days') === 1) {
      return 'Yesterday ' + msgTime.format('HH:mm');
    } else {
      return msgTime.format('MMM DD, HH:mm');
    }
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

  const getStatusColor = () => {
    switch (status) {
      case 'read':
        return theme.read;
      case 'delivered':
        return theme.delivered;
      default:
        return theme.textSecondary;
    }
  };

  return (
    <View
      style={[
        styles.container,
        isOwnMessage ? styles.ownMessage : styles.otherMessage,
      ]}
    >
      {!isOwnMessage && (
        <Text style={[styles.username, { color: theme.primary }]}>
          {username}
        </Text>
      )}
      <Text
        style={[
          styles.message,
          { color: isOwnMessage ? theme.ownMessageText : theme.otherMessageText }
        ]}
      >
        {message}
      </Text>
      <View style={styles.footer}>
        <Text
          style={[
            styles.time,
            { color: isOwnMessage ? theme.ownMessageText : theme.textSecondary, opacity: 0.7 }
          ]}
        >
          {formatTime(timestamp)}
        </Text>
        {isOwnMessage && (
          <Text style={[styles.status, { color: getStatusColor() }]}>
            {' '}{getStatusIcon()}
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
    borderRadius: 16,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    marginLeft: 50,
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    marginRight: 50,
    borderBottomLeftRadius: 4,
  },
  username: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  time: {
    fontSize: 11,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default EnhancedMessageBubble;
