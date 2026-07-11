# ChatFlix Frontend V2.0

React Native mobile app built with Expo for ChatFlix real-time chat application.

## Features

- ✅ Email/password authentication
- ✅ One-to-one private chats
- ✅ Real-time messaging
- ✅ Typing indicators with animation
- ✅ Message status (✓ sent, ✓✓ delivered/read)
- ✅ Dark/Light theme toggle
- ✅ User search and contacts
- ✅ Color-coded avatars
- ✅ Online/offline status
- ✅ Pull-to-refresh
- ✅ Unread message badges
- ✅ Emoji support
- ✅ Auto-scroll to latest messages

## Quick Start

```bash
# Install dependencies
npm install

# Start Expo development server
npm start

# Run on specific platform
npm run android    # Android device/emulator
npm run ios        # iOS simulator (Mac only)
npm run web        # Web browser
```

## Configuration

### Backend URL Setup

Edit `src/utils/config.js`:

```javascript
// Production (default)
export const API_URL = 'https://chatflix-sjfr.onrender.com';
export const SOCKET_URL = 'https://chatflix-sjfr.onrender.com';

// For local development, use:
// export const API_URL = 'http://10.0.2.2:3000';  // Android emulator
// export const SOCKET_URL = 'http://10.0.2.2:3000';
```

**Important URLs:**
- **Production**: `https://chatflix-sjfr.onrender.com`
- **Localhost**: `http://localhost:3000` (Web/iOS simulator)
- **Android Emulator**: `http://10.0.2.2:3000`
- **Physical Device**: `http://YOUR_COMPUTER_IP:3000` (same WiFi)

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── EnhancedMessageBubble.js   # Message with status indicators
│   │   ├── TypingIndicator.js         # Animated typing dots
│   │   └── UserAvatar.js              # Color-coded user avatars
│   ├── screens/
│   │   ├── AuthScreen.js              # Login/Signup UI
│   │   ├── ChatListScreen.js          # Conversation list
│   │   ├── ChatRoomScreen.js          # Chat interface
│   │   └── ContactsScreen.js          # Search & contacts
│   ├── services/
│   │   ├── apiService.js              # REST API client
│   │   └── socketService.js           # Socket.io client
│   └── utils/
│       ├── config.js                  # App configuration
│       └── theme.js                   # Light/Dark themes
├── assets/                            # Images and icons
├── App.js                             # Root component with navigation
├── app.json                           # Expo configuration
├── eas.json                           # EAS Build configuration
├── package.json
└── README.md
```

## Screens

### AuthScreen
- Login form with email/password
- Registration form with username, email, password
- Form validation
- Loading states
- Error handling

### ChatListScreen
- List of all conversations
- Online status badges
- Unread message counts
- Pull-to-refresh
- Theme toggle button
- Logout button
- FAB to start new chat

### ChatRoomScreen
- Message list with auto-scroll
- Typing indicators
- Message status indicators
- Online status in header
- Text input with character limit (1000)
- Send button
- Emoji support

### ContactsScreen
- Search users by username or email
- Contact list
- Online/offline indicators
- Tap to start chat
- Loading states

## Components

### EnhancedMessageBubble
- iOS-style message bubbles
- Sent/Delivered/Read indicators
- Timestamps with smart formatting
- Different colors for own/other messages
- Username display for group chats

### TypingIndicator
- Animated dots
- Shows who is typing
- Smooth animations

### UserAvatar
- Generates color from username
- Shows initials (2 letters)
- Consistent colors per user
- Shadow and elevation

## Services

### apiService.js
- Axios-based HTTP client
- Automatic JWT token injection
- Request/response interceptors
- Error handling
- Endpoints:
  - `register(username, email, password, displayName)`
  - `login(email, password)`
  - `searchUsers(query)`
  - `getContacts()`
  - `getRooms()`
  - `getPrivateRoom(userId)`
  - `createGroupRoom(name, participantIds)`
  - `getRoomMessages(roomId, limit, skip)`
  - `sendMessage(roomId, message)`

### socketService.js
- Socket.io client wrapper
- Automatic reconnection
- JWT authentication
- Event management
- Methods:
  - `connect()` - Connect with JWT
  - `disconnect()` - Close connection
  - `joinRoom(roomId, userId)` - Join chat room
  - `leaveRoom(roomId)` - Leave room
  - `sendMessage(roomId, senderId, message)` - Send message
  - `startTyping(roomId, userId)` - Start typing
  - `stopTyping(roomId, userId)` - Stop typing

## Themes

### Light Theme
```javascript
{
  background: '#F0F2F5',      // Light gray
  surface: '#FFFFFF',          // White
  primary: '#0084FF',          // Blue
  text: '#000000',             // Black
  ownMessageBg: '#0084FF',     // Blue bubbles
  otherMessageBg: '#E4E6EB',   // Gray bubbles
  online: '#31A24C',           // Green
  // ... more colors
}
```

### Dark Theme
```javascript
{
  background: '#000000',       // Pure black (OLED)
  surface: '#1C1C1E',          // Dark gray
  primary: '#0A84FF',          // iOS blue
  text: '#FFFFFF',             // White
  ownMessageBg: '#0A84FF',     // Blue bubbles
  otherMessageBg: '#2C2C2E',   // Dark gray bubbles
  online: '#32D74B',           // iOS green
  // ... more colors
}
```

## Building for Production

### Android APK (via EAS Build)

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo account
eas login

# Configure project (first time only)
eas build:configure

# Build APK
npx eas-cli@latest build --platform android --profile preview

# Build for production (AAB for Play Store)
npx eas-cli@latest build --platform android --profile production
```

Build takes 10-15 minutes. You'll get a download link when complete.

### iOS IPA (via EAS Build)

```bash
# Build for iOS (requires Apple Developer account)
npx eas-cli@latest build --platform ios --profile preview
```

## Testing on Device

### Using Expo Go (Development)

1. Install **Expo Go** from:
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Ensure device and computer are on same WiFi

3. Run `npm start`

4. Scan QR code:
   - **Android**: Use Expo Go app
   - **iOS**: Use Camera app

### Using Built APK (Production)

1. Download APK from EAS Build
2. Transfer to Android device
3. Enable "Install from Unknown Sources"
4. Install APK
5. Open ChatFlix app

## Environment Variables (Optional)

Create `.env` file in frontend root:

```env
EXPO_PUBLIC_API_URL=https://chatflix-sjfr.onrender.com
EXPO_PUBLIC_SOCKET_URL=https://chatflix-sjfr.onrender.com
```

Access in code:
```javascript
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'fallback-url';
```

## Dependencies

### Core
- `react-native@0.72.6` - Mobile framework
- `expo@~49.0.15` - Development platform
- `react@18.2.0` - UI library

### Navigation
- `@react-navigation/native@^6.1.9` - Navigation system
- `@react-navigation/stack@^6.3.20` - Stack navigator
- `@react-navigation/bottom-tabs@^6.5.11` - Tab navigator
- `react-native-screens@~3.22.0` - Native screens
- `react-native-gesture-handler@~2.12.0` - Gestures
- `react-native-safe-area-context@4.6.3` - Safe areas

### Utilities
- `socket.io-client@^4.6.1` - Real-time communication
- `axios@^1.6.2` - HTTP client
- `@react-native-async-storage/async-storage@1.18.2` - Local storage
- `moment@^2.29.4` - Date formatting
- `expo-status-bar@~1.6.0` - Status bar control

## Common Issues

### Cannot Connect to Backend

**Issue**: App shows "Failed to connect" or network errors

**Solution**:
1. Check `src/utils/config.js` has correct backend URL
2. Ensure backend is running (test with browser)
3. For local dev, use correct IP:
   - Android emulator: `10.0.2.2:3000`
   - Physical device: Your computer's local IP
4. Check firewall settings

### Build Failed on EAS

**Issue**: EAS build fails with dependency errors

**Solution**:
```bash
# Clear caches
rm -rf node_modules package-lock.json
npm install

# Try build again
npx eas-cli@latest build --platform android --profile preview
```

### App Crashes on Startup

**Issue**: App crashes immediately after opening

**Solution**:
1. Check if backend is accessible
2. Clear app data and restart
3. Rebuild with `--clear` flag
4. Check console logs for errors

### Socket Disconnects Frequently

**Issue**: Real-time messages stop working

**Solution**:
1. Check backend CORS configuration
2. Verify Socket.io versions match (client & server both v4)
3. Check network stability
4. Review backend logs for connection errors

### Typing Indicators Don't Work

**Issue**: Can't see when someone is typing

**Solution**:
1. Ensure socket is connected (`socketService.isConnected`)
2. Check typing timeout (3 seconds default)
3. Verify `typing:start` and `typing:stop` events are emitted
4. Check if other user is in same room

## Performance Tips

- Messages are paginated (50 per load)
- Images are optimized and cached
- Re-renders minimized with React.memo
- FlatList for efficient scrolling
- AsyncStorage for fast local access

## Development Tips

```bash
# Clear cache if issues occur
expo start -c

# Reset Metro bundler
expo start --reset-cache

# Check for outdated packages
npm outdated

# Run on specific device
expo start --android --device

# View logs
npx react-native log-android
npx react-native log-ios
```

## Scripts

```json
{
  "start": "expo start",           // Start dev server
  "android": "expo start --android", // Run on Android
  "ios": "expo start --ios",       // Run on iOS
  "web": "expo start --web"        // Run in browser
}
```

## Debugging

### React Native Debugger
1. Install React Native Debugger
2. Open app, press `Ctrl+M` (Android) or `Cmd+D` (iOS)
3. Select "Debug JS Remotely"

### Console Logs
- Use `console.log()` for debugging
- Check Expo Dev Tools in browser
- Use React Native Debugger for advanced debugging

### Redux DevTools
Not used in this app, but can be integrated if needed.

## License

Open source - Available for learning purposes

---

**Version**: 2.0.0 | **Status**: ✅ Production Ready | **Platform**: iOS & Android
