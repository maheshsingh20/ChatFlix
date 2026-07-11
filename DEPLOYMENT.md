# 🚀 Deployment Guide

## Backend Deployment to Render (Free)

### Step 1: Prepare Backend for Deployment

Your backend is already configured. Just ensure `.env` has MongoDB Atlas URL.

### Step 2: Deploy to Render

1. **Go to Render**: https://render.com/
2. **Sign up/Login** (can use GitHub account)
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repository** or use "Public Git repository"
5. **Configure the service:**
   
   ```
   Name: chat-app-backend (or any name)
   Region: Choose closest to you
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

6. **Add Environment Variables:**
   - Click "Advanced"
   - Add environment variables:
     ```
     PORT=3000
     MONGODB_URI=your_mongodb_atlas_connection_string
     NODE_ENV=production
     ```

7. **Click "Create Web Service"**

8. **Wait for deployment** (takes 2-5 minutes)

9. **Copy your URL**: You'll get something like:
   ```
   https://chat-app-backend-xyz.onrender.com
   ```

### Step 3: Test Your Deployed Backend

```bash
curl https://YOUR_RENDER_URL/health
```

Should return:
```json
{
  "success": true,
  "message": "Server is running"
}
```

### Step 4: Update Frontend Config

Edit `frontend/src/utils/config.js`:

```javascript
export const API_URL = 'https://YOUR_RENDER_URL';
export const SOCKET_URL = 'https://YOUR_RENDER_URL';
```

### Step 5: Rebuild APK

```bash
cd frontend
npx eas-cli@latest build --platform android --profile preview
```

---

## Alternative: Railway Deployment

1. **Go to Railway**: https://railway.app/
2. **Sign up with GitHub**
3. **New Project → Deploy from GitHub repo**
4. **Select your repository**
5. **Add MongoDB plugin** (or use Atlas)
6. **Add environment variables**
7. **Deploy automatically**

Railway URL format: `https://your-app.up.railway.app`

---

## Alternative: Local Network Testing (Quick Test)

If you just want to test on your phone without deployment:

### Step 1: Find Your Computer's IP

**Windows:**
```bash
ipconfig
```
Look for IPv4 Address (e.g., 192.168.1.100)

**Mac/Linux:**
```bash
ifconfig | grep inet
```

### Step 2: Update Frontend Config

Edit `frontend/src/utils/config.js`:

```javascript
export const API_URL = 'http://192.168.1.100:3000'; // Your IP
export const SOCKET_URL = 'http://192.168.1.100:3000';
```

### Step 3: Make Sure Backend is Running

```bash
cd backend
npm start
```

### Step 4: Allow Firewall Access

**Windows:**
1. Open Windows Defender Firewall
2. Advanced Settings → Inbound Rules
3. New Rule → Port → TCP → 3000
4. Allow the connection

### Step 5: Connect Phone to Same WiFi

- Phone and computer must be on same network
- Rebuild APK or use Expo Go to test

---

## MongoDB Atlas Setup (If Not Done)

1. Go to https://cloud.mongodb.com/
2. Create free cluster (M0)
3. Create database user
4. Network Access → Add IP: `0.0.0.0/0` (allow all)
5. Get connection string
6. Update backend `.env` file

---

## Verifying Connection

Once deployed, test these endpoints:

```bash
# Health check
curl https://YOUR_URL/health

# Get messages
curl https://YOUR_URL/api/messages

# Test Socket.io (in browser console)
const socket = io('https://YOUR_URL');
socket.on('connect', () => console.log('Connected!'));
```

---

## Troubleshooting

### Backend doesn't start on Render
- Check logs in Render dashboard
- Verify MongoDB connection string
- Ensure all dependencies in package.json

### Phone can't connect
- Check URL in config.js
- Verify backend is running
- Check firewall settings (local network)
- Try HTTPS URL (deployed version)

### Socket.io connection fails
- Ensure CORS is enabled (already configured)
- Check if WebSocket is supported
- Try polling transport as fallback

---

## Quick Deploy Checklist

- [ ] MongoDB Atlas configured
- [ ] Backend deployed to Render/Railway
- [ ] Backend URL copied
- [ ] Frontend config.js updated
- [ ] APK rebuilt
- [ ] Tested on phone

---

## Cost

- **MongoDB Atlas**: Free (M0 tier)
- **Render**: Free tier available (750 hours/month)
- **Railway**: Free tier with limits
- **Total**: $0 for development/testing

Note: Free tiers may have cold starts (takes 30s to wake up after inactivity)

---

**After deployment, your app will be accessible from anywhere with internet! 🎉**
