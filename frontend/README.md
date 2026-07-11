# Frontend - Real-Time Chat Application

React Native mobile app built with Expo for the chat application.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

## Configuration

Update `src/utils/config.js` with your backend URL:

```javascript
export const API_URL = 'http://YOUR_IP:3000';
export const SOCKET_URL = 'http://YOUR_IP:3000';
```

### Important URLs:

- **Localhost**: `http://localhost:3000` (Web only)
- **Android Emulator**: `http://10.0.2.2:3000`
- **Physical Device**: `http://YOUR_COMPUTER_IP:3000`
- **iOS Simulator**: `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── MessageBubble.js    # Message display
│   │   └── TypingIndicator.js  # Typing animation
│   ├── screens/
│   │   ├── LoginScreen.js      # Login UI
│   │   └── ChatScreen.js       # Chat UI
│   ├── services/
│   │   ├── apiService.js       # REST API
│   │   └── socketService.js    # Socket.io
│   └── utils/
│       └── config.js           # Configuration
├── App.js                      # Root component
└── package.json
```

## Features

- ✅ Real-time messaging
- ✅ Typing indicators
- ✅ Online users count
- ✅ Message status (sent/delivered/read)
- ✅ Chat history
- ✅ Auto-reconnect
- ✅ Username persistence

## Building for Production

### Android APK

```bash
# Using EAS Build (recommended)
npm install -g eas-cli
eas build --platform android

# Using legacy expo build
expo build:android
```

### iOS IPA

```bash
eas build --platform ios
```

## Testing on Physical Device

1. Install **Expo Go** from app store
2. Make sure device and computer are on same WiFi
3. Run `npm start`
4. Scan QR code with Expo Go (Android) or Camera (iOS)

## Common Issues

**Cannot connect to backend:**
- Update config.js with correct IP address
- Ensure backend is running
- Check firewall settings

**Expo Start Failed:**
```bash
expo start -c  # Clear cache
```

**Build Failed:**
```bash
rm -rf node_modules
npm install
```

## Environment Variables

Create `.env` file (optional):

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000
```

## Dependencies

- **react-native**: Mobile framework
- **expo**: Development platform
- **socket.io-client**: Real-time communication
- **axios**: HTTP client
- **moment**: Date formatting
- **@react-native-async-storage/async-storage**: Local storage
