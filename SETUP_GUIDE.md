# 🚀 Complete Setup Guide

Follow these steps to get the chat application running on your local machine.

## Prerequisites Installation

### 1. Install Node.js
- Visit [nodejs.org](https://nodejs.org/)
- Download and install the LTS version (v16 or higher)
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

### 2. Install MongoDB

**Option A: Local Installation (Windows)**
1. Download MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Start MongoDB service:
   ```bash
   net start MongoDB
   ```

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (Free tier available)
3. Create a database user (Database Access → Add New Database User)
4. Whitelist your IP (Network Access → Add IP Address → Allow Access from Anywhere: 0.0.0.0/0)
5. Get connection string (Connect → Connect your application)
   - Replace `<password>` with your database user password
   - Replace `myFirstDatabase` with your database name (e.g., `chatapp`)

### 3. Install Expo CLI (for React Native)
```bash
npm install -g expo-cli
```

### 4. Install Android Studio (Optional - for emulator)
- Download from [developer.android.com/studio](https://developer.android.com/studio)
- Install Android SDK and create a virtual device

### 5. Install Expo Go (for physical device)
- **Android**: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)

## Step-by-Step Setup

### Step 1: Clone/Download the Project
```bash
# If you have the project as zip, extract it
# If you have git URL, clone it:
git clone <repository-url>
cd chat-app
```

### Step 2: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install all dependencies
npm install

# This will install:
# - express (web framework)
# - socket.io (real-time communication)
# - mongoose (MongoDB ORM)
# - cors (cross-origin requests)
# - dotenv (environment variables)
```

**Create .env file:**

Windows Command Prompt:
```bash
copy .env.example .env
```

PowerShell:
```bash
Copy-Item .env.example .env
```

Mac/Linux:
```bash
cp .env.example .env
```

**Edit .env file** (use Notepad or any text editor):

For local MongoDB:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/chatapp
NODE_ENV=development
```

For MongoDB Atlas:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/chatapp?retryWrites=true&w=majority
NODE_ENV=development
```

**Start the backend server:**
```bash
npm start
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server is running on port 3000
📡 Socket.io is ready for connections
```

**Keep this terminal open!** The backend must be running for the app to work.

### Step 3: Frontend Setup

**Open a NEW terminal window** (keep backend running in the first one)

```bash
# Navigate to frontend folder (from project root)
cd frontend

# Install all dependencies
npm install

# This will install:
# - react-native (mobile framework)
# - expo (development tools)
# - socket.io-client (real-time client)
# - axios (HTTP client)
# - moment (date formatting)
```

**Configure Backend URL:**

1. Find your computer's IP address:
   
   Windows (Command Prompt):
   ```bash
   ipconfig
   ```
   Look for "IPv4 Address" (usually something like 192.168.x.x)
   
   Mac:
   ```bash
   ifconfig | grep "inet "
   ```
   
   Linux:
   ```bash
   ip addr show
   ```

2. Edit `src/utils/config.js`:
   
   For Android Emulator:
   ```javascript
   export const API_URL = 'http://10.0.2.2:3000';
   export const SOCKET_URL = 'http://10.0.2.2:3000';
   ```
   
   For Physical Device (replace with YOUR IP):
   ```javascript
   export const API_URL = 'http://192.168.1.100:3000';
   export const SOCKET_URL = 'http://192.168.1.100:3000';
   ```
   
   For iOS Simulator or Web:
   ```javascript
   export const API_URL = 'http://localhost:3000';
   export const SOCKET_URL = 'http://localhost:3000';
   ```

**Start the frontend:**
```bash
npm start
```

This will open Expo DevTools in your browser.

### Step 4: Run the App

**Option A: Physical Device (Easiest)**
1. Install "Expo Go" app from Play Store (Android) or App Store (iOS)
2. Make sure your phone and computer are on the SAME WiFi network
3. Open Expo Go app
4. Scan the QR code from the terminal or browser
5. App will load on your device

**Option B: Android Emulator**
1. Start Android Studio
2. Open AVD Manager (Virtual Device Manager)
3. Start an emulator
4. In Expo terminal, press `a` to open on Android
5. App will install and run on emulator

**Option C: Web Browser**
1. In Expo terminal, press `w`
2. App will open in your default browser
3. Note: Some mobile features may not work fully on web

### Step 5: Test the Application

1. **First User:**
   - Enter a username (e.g., "Alice")
   - Click "Join Chat"
   - You should see the chat screen

2. **Second User (Testing Real-Time):**
   - Open the app on another device/browser
   - Enter a different username (e.g., "Bob")
   - Click "Join Chat"

3. **Test Features:**
   - Send messages from both devices
   - Messages should appear instantly on both
   - Watch the "X online" counter update
   - Start typing to see typing indicator
   - Check message timestamps

## Troubleshooting Common Issues

### Issue 1: "Cannot connect to backend"

**Solution:**
- Verify backend is running (check terminal)
- Check if MongoDB is connected
- Verify IP address in config.js
- Disable firewall temporarily or add exception for port 3000
- For Android emulator, use `10.0.2.2` instead of `localhost`

### Issue 2: "MongoDB connection failed"

**Solution:**
- Check if MongoDB service is running:
  ```bash
  # Windows
  net start MongoDB
  
  # Mac/Linux
  sudo systemctl start mongod
  ```
- Verify MONGODB_URI in .env file
- For Atlas, check network access settings

### Issue 3: "Port 3000 already in use"

**Solution:**
- Change PORT in .env to 3001 or another number
- Update frontend config.js with new port
- Or kill the process using port 3000:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:3000 | xargs kill -9
  ```

### Issue 4: "Expo command not found"

**Solution:**
```bash
npm install -g expo-cli
# or
npx expo start
```

### Issue 5: "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Clear npm cache
npm cache clean --force
```

### Issue 6: "Cannot scan QR code"

**Solution:**
- Use "Expo Go" app, not regular camera
- Make sure phone and computer are on same WiFi
- Try entering the URL manually in Expo Go
- Check if firewall is blocking connection

## Testing Checklist

Once everything is running, test these features:

- [ ] Login with username works
- [ ] Can send messages
- [ ] Messages appear instantly on other devices
- [ ] Timestamps are displayed correctly
- [ ] Typing indicator appears when typing
- [ ] Online users count is correct
- [ ] Chat history persists after app restart
- [ ] Can logout successfully
- [ ] App reconnects after losing connection

## Next Steps

### Building APK for Android

```bash
cd frontend

# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Configure build
eas build:configure

# Build APK
eas build --platform android --profile preview
```

The APK will be available for download from the Expo dashboard.

### Deploying Backend

See main README.md for deployment instructions to Render or Railway.

## Getting Help

If you encounter issues:

1. Check the error message carefully
2. Verify all prerequisites are installed
3. Check that both backend and MongoDB are running
4. Verify IP addresses and ports in configuration
5. Review the troubleshooting section above
6. Check terminal logs for detailed error messages

## Architecture Overview

```
User Device (Frontend)
    ↓
  Expo App (React Native)
    ↓
  Socket.io Client + REST API (Axios)
    ↓
  Backend Server (Node.js + Express)
    ↓
  Socket.io Server + REST Routes
    ↓
  MongoDB Database
```

## Quick Commands Reference

**Backend:**
```bash
cd backend
npm install          # Install dependencies
npm start           # Start server
npm run dev         # Start with auto-reload
```

**Frontend:**
```bash
cd frontend
npm install          # Install dependencies
npm start           # Start Expo
npm run android     # Run on Android
npm run ios         # Run on iOS
npm run web         # Run on web
```

**MongoDB:**
```bash
# Windows
net start MongoDB
net stop MongoDB

# Mac/Linux
sudo systemctl start mongod
sudo systemctl stop mongod
sudo systemctl status mongod
```

---

**That's it! You should now have a fully functional real-time chat application running. Happy chatting! 💬**
