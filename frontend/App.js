import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthScreen from './src/screens/AuthScreen';
import ChatListScreen from './src/screens/ChatListScreen';
import ChatRoomScreen from './src/screens/ChatRoomScreen';
import ContactsScreen from './src/screens/ContactsScreen';
import { lightTheme, darkTheme } from './src/utils/theme';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('token');
      const savedUser = await AsyncStorage.getItem('user');
      const savedTheme = await AsyncStorage.getItem('theme');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }

      if (savedTheme === 'dark') setIsDarkMode(true);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['token', 'user']);
    setUser(null);
    setToken(null);
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      {!user || !token ? (
        <AuthScreen onAuth={handleAuth} theme={theme} />
      ) : (
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: theme.headerBg }, headerTintColor: theme.headerText }}>
          <Stack.Screen name="ChatList" options={{ title: 'Chats' }}>
            {(props) => <ChatListScreen {...props} user={user} token={token} theme={theme} isDarkMode={isDarkMode} toggleTheme={toggleTheme} onLogout={handleLogout} />}
          </Stack.Screen>
          <Stack.Screen name="Chat" options={{ title: 'Chat' }}>
            {(props) => <ChatRoomScreen {...props} user={user} token={token} theme={theme} isDarkMode={isDarkMode} />}
          </Stack.Screen>
          <Stack.Screen name="Contacts" options={{ title: 'Contacts' }}>
            {(props) => <ContactsScreen {...props} user={user} token={token} theme={theme} />}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
