# 🧪 Testing Guide

Complete guide to test the real-time chat application.

## Table of Contents
- [Quick Test](#quick-test)
- [Backend Testing](#backend-testing)
- [Frontend Testing](#frontend-testing)
- [Socket.io Testing](#socketio-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Performance Testing](#performance-testing)

## Quick Test

### 1. Backend Health Check

**Using Browser:**
```
Open: http://localhost:3000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Using cURL:**
```bash
curl http://localhost:3000/health
```

### 2. Database Connection

Check backend terminal logs for:
```
✅ MongoDB connected successfully
```

If you see this, MongoDB is connected properly.

### 3. Frontend Connection

Open the app and check for:
- No connection errors
- "Connecting to chat..." screen appears briefly
- Login screen loads successfully

## Backend Testing

### REST API Tests

#### Test 1: Get Chat History

```bash
curl http://localhost:3000/api/messages
```

Expected:
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "total": 0,
    "limit": 50,
    "skip": 0
  }
}
```

#### Test 2: Send Message (REST)

```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"TestUser\",\"message\":\"Hello from cURL!\"}"
```

Expected:
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "username": "TestUser",
    "message": "Hello from cURL!",
    "timestamp": "...",
    "status": "sent"
  }
}
```

#### Test 3: Update Message Status

First get a message ID from test 1 or 2, then:

```bash
curl -X PATCH http://localhost:3000/api/messages/<MESSAGE_ID>/status \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"read\"}"
```

#### Test 4: Invalid Requests

Test error handling:

```bash
# Empty message
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"test\"}"

# Expected: 400 error with validation message
```

### Database Tests

**Check Messages Collection:**

```bash
# Using MongoDB Shell
mongosh
use chatapp
db.messages.find().pretty()
```

**Check Users Collection:**

```bash
db.users.find().pretty()
```

## Frontend Testing

### Manual Test Cases

#### Test Case 1: Login Flow

**Steps:**
1. Open the app
2. Leave username empty, click "Join Chat"
3. Expected: Error message "Please enter a username"
4. Enter username "TestUser1"
5. Click "Join Chat"
6. Expected: Navigate to chat screen

**Pass Criteria:**
- ✅ Empty username validation works
- ✅ Valid username allows login
- ✅ Username is saved (survives app restart)

#### Test Case 2: Send Messages

**Steps:**
1. Login as "User1"
2. Type "Hello World"
3. Click send button
4. Expected: Message appears in chat

**Pass Criteria:**
- ✅ Message appears immediately
- ✅ Message shows correct username
- ✅ Timestamp is displayed
- ✅ Message bubble styled correctly

#### Test Case 3: Receive Messages

**Setup:** Two devices/browsers

**Steps:**
1. Device A: Login as "Alice"
2. Device B: Login as "Bob"
3. Device A: Send "Hi Bob!"
4. Expected on Device B: Message appears instantly
5. Device B: Send "Hi Alice!"
6. Expected on Device A: Message appears instantly

**Pass Criteria:**
- ✅ Messages appear on both devices
- ✅ No page refresh needed
- ✅ Messages arrive in < 1 second
- ✅ Correct sender displayed

#### Test Case 4: Chat History

**Steps:**
1. Send 5 messages
2. Close the app completely
3. Reopen the app
4. Login with same username
5. Expected: Previous messages are visible

**Pass Criteria:**
- ✅ All messages persist
- ✅ Messages in correct order
- ✅ Timestamps preserved

#### Test Case 5: Typing Indicator

**Setup:** Two devices

**Steps:**
1. Device A & B: Both logged in
2. Device A: Start typing (don't send)
3. Expected on Device B: "Alice is typing..." appears
4. Device A: Stop typing for 2 seconds
5. Expected on Device B: Typing indicator disappears

**Pass Criteria:**
- ✅ Typing indicator appears
- ✅ Shows correct username
- ✅ Disappears after inactivity
- ✅ Animation works smoothly

#### Test Case 6: Online Users

**Setup:** Two devices

**Steps:**
1. Device A: Login as "Alice"
2. Check online count: Expected "1 online"
3. Device B: Login as "Bob"
4. Check on Device A: Expected "2 online"
5. Device B: Logout
6. Check on Device A: Expected "1 online"

**Pass Criteria:**
- ✅ Count updates in real-time
- ✅ Accurate user count
- ✅ Updates on join/leave

#### Test Case 7: Message Status

**Steps:**
1. Send a message
2. Check for status indicator
3. Expected: ✓ (sent)
4. After a moment: ✓✓ (delivered)
5. When other user views: ✓✓ (green/read)

**Pass Criteria:**
- ✅ Status indicators visible
- ✅ Status updates automatically
- ✅ Visual difference between states

#### Test Case 8: Long Messages

**Steps:**
1. Type a very long message (200+ characters)
2. Send message
3. Expected: Message wraps properly in bubble

**Pass Criteria:**
- ✅ Long messages don't overflow
- ✅ Text is readable
- ✅ Bubble adjusts size

#### Test Case 9: Special Characters

**Steps:**
1. Send message with emojis: "Hello 😊 🎉 💬"
2. Send message with symbols: "Test @#$%^&*()"
3. Expected: All characters display correctly

**Pass Criteria:**
- ✅ Emojis render properly
- ✅ Special characters work
- ✅ No encoding issues

#### Test Case 10: Logout

**Steps:**
1. Login and send messages
2. Click "Logout" button
3. Confirm logout
4. Expected: Return to login screen

**Pass Criteria:**
- ✅ Confirmation dialog appears
- ✅ Returns to login
- ✅ Username cleared
- ✅ Socket disconnected

## Socket.io Testing

### Using Socket.io Client Tester

Create a simple test file `test-socket.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Socket.io Test</title>
  <script src="https://cdn.socket.io/4.6.1/socket.io.min.js"></script>
</head>
<body>
  <h1>Socket.io Test</h1>
  <div id="output"></div>
  
  <script>
    const socket = io('http://localhost:3000');
    const output = document.getElementById('output');
    
    socket.on('connect', () => {
      output.innerHTML += '<p>✅ Connected: ' + socket.id + '</p>';
      
      // Test login
      socket.emit('user:login', 'TestUser');
      
      // Test send message
      setTimeout(() => {
        socket.emit('message:send', {
          username: 'TestUser',
          message: 'Test message from browser'
        });
      }, 1000);
    });
    
    socket.on('message:receive', (data) => {
      output.innerHTML += '<p>📨 Message: ' + JSON.stringify(data) + '</p>';
    });
    
    socket.on('user:joined', (data) => {
      output.innerHTML += '<p>👤 User joined: ' + data.username + '</p>';
    });
    
    socket.on('disconnect', () => {
      output.innerHTML += '<p>❌ Disconnected</p>';
    });
  </script>
</body>
</html>
```

Open this file in a browser to test Socket.io connection.

## End-to-End Testing

### Scenario 1: New User Experience

1. ✅ App opens to login screen
2. ✅ Enter username and login
3. ✅ See empty chat or recent messages
4. ✅ Send first message successfully
5. ✅ Receive messages from others
6. ✅ Logout and re-login shows history

### Scenario 2: Active Chat Session

1. ✅ Two users chatting back and forth
2. ✅ Messages arrive instantly (< 1s)
3. ✅ Typing indicators work
4. ✅ Online count accurate
5. ✅ No messages lost
6. ✅ Timestamps correct

### Scenario 3: Network Issues

1. ✅ Disconnect WiFi
2. ✅ Try to send message
3. ✅ App shows connection error
4. ✅ Reconnect WiFi
5. ✅ App reconnects automatically
6. ✅ Messages sync properly

### Scenario 4: Multiple Devices

1. ✅ Login on 3+ devices
2. ✅ Send messages from each
3. ✅ All devices receive all messages
4. ✅ Order is consistent
5. ✅ No duplicates

## Performance Testing

### Load Test

**Test Message Throughput:**

```javascript
// Run in browser console on multiple tabs
for (let i = 0; i < 100; i++) {
  setTimeout(() => {
    // Send message via app
  }, i * 100);
}
```

**Expected:**
- ✅ All messages sent
- ✅ All messages received
- ✅ No crashes
- ✅ Reasonable delay (< 2s)

### Stress Test

**Test with Many Users:**
1. Open 10+ tabs/devices
2. All send messages simultaneously
3. Monitor server CPU/memory
4. Check for errors in logs

**Expected:**
- ✅ Server handles load
- ✅ Messages delivered to all
- ✅ No data loss

## Automated Testing (Optional)

### Backend Unit Tests

Create `backend/test/message.test.js`:

```javascript
// Example using Jest
const request = require('supertest');
const app = require('../server');

describe('Message API', () => {
  test('GET /api/messages returns chat history', async () => {
    const response = await request(app).get('/api/messages');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
  
  test('POST /api/messages creates new message', async () => {
    const response = await request(app)
      .post('/api/messages')
      .send({ username: 'test', message: 'hello' });
    expect(response.status).toBe(201);
  });
});
```

## Test Results Checklist

Use this checklist to verify all features:

### Core Features
- [ ] Send messages ✓
- [ ] Receive messages ✓
- [ ] Real-time updates (no refresh) ✓
- [ ] Chat history persists ✓
- [ ] Timestamps displayed ✓

### Bonus Features
- [ ] Username login ✓
- [ ] Typing indicator ✓
- [ ] Online users count ✓
- [ ] Message status (sent/delivered/read) ✓
- [ ] MongoDB storage ✓

### Error Handling
- [ ] Empty message validation ✓
- [ ] Network error handling ✓
- [ ] Server disconnection handling ✓
- [ ] Invalid data handling ✓

### User Experience
- [ ] Smooth animations ✓
- [ ] Fast message delivery (< 1s) ✓
- [ ] Clean UI ✓
- [ ] Mobile responsive ✓
- [ ] Auto-scroll to new messages ✓

## Bug Reporting Template

If you find issues:

```markdown
**Issue Title:** [Brief description]

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. ...

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- Device: [Android/iOS/Web]
- OS Version: [version]
- App Version: [version]

**Screenshots:**
[Attach if applicable]

**Console Logs:**
[Paste error messages]
```

## Test Coverage Summary

- ✅ **Backend API**: All REST endpoints
- ✅ **Socket.io**: All events (send, receive, typing, status)
- ✅ **Database**: CRUD operations
- ✅ **Frontend**: All user flows
- ✅ **Real-time**: Message delivery, presence, typing
- ✅ **Error Handling**: Network, validation, server errors
- ✅ **Performance**: Load and stress testing

---

**Testing Complete! 🎉**

If all tests pass, your chat application is production-ready!
