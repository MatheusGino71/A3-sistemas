# Sentinela PIX - Notification System Technical Documentation

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [WebSocket Implementation](#websocket-implementation)
4. [Firebase Cloud Messaging](#firebase-cloud-messaging)
5. [Notification Flow](#notification-flow)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Client Implementation](#client-implementation)
9. [Error Handling and Fallbacks](#error-handling-and-fallbacks)
10. [Performance Considerations](#performance-considerations)
11. [Security](#security)
12. [Testing](#testing)

## System Overview

The Sentinela PIX notification system is a multi-channel, real-time notification delivery platform designed to ensure reliable message delivery to users across different connection states and devices.

### Design Goals

- **Real-time Delivery**: Sub-second notification delivery for active users
- **Reliability**: Guaranteed delivery through multiple fallback mechanisms
- **Scalability**: Support for thousands of concurrent connections
- **Multi-channel**: WebSocket, push notifications, and email delivery
- **Offline Support**: Queue notifications for offline users
- **Cross-device**: Synchronize notifications across multiple devices

### Notification Channels

1. **WebSocket (Primary)**: Real-time bidirectional communication for online users
2. **Firebase Cloud Messaging**: Browser push notifications for offline/background users
3. **Email** (Future): Critical notifications via email
4. **SMS** (Future): High-priority alerts via SMS

## Architecture

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      Client Layer                             │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │   Dashboard    │  │  Profile Page  │  │  Settings Page │ │
│  │   (active)     │  │   (active)     │  │   (active)     │ │
│  └────────┬───────┘  └────────┬───────┘  └────────┬───────┘ │
│           │                   │                    │          │
│           └───────────────────┴────────────────────┘          │
│                               │                               │
│                    ┌──────────▼──────────┐                   │
│                    │   NotificationSystem │                   │
│                    │   (user-system.js)   │                   │
│                    └──────────┬──────────┘                   │
│                               │                               │
│                ┌──────────────┼──────────────┐               │
│                │              │              │               │
│        ┌───────▼──────┐  ┌───▼────┐  ┌─────▼─────┐         │
│        │  WebSocket   │  │  FCM   │  │  Storage  │         │
│        │   Client     │  │ Client │  │ (Memory)  │         │
│        └───────┬──────┘  └───┬────┘  └───────────┘         │
└────────────────┼─────────────┼────────────────────────────────┘
                 │             │
                 │ WS/WSS      │ HTTPS
                 │             │
┌────────────────▼─────────────▼────────────────────────────────┐
│                      Server Layer                              │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Express.js Server (server.js)              │  │
│  │  ┌──────────────────┐  ┌───────────────────────────┐   │  │
│  │  │  HTTP Server     │  │   WebSocket Server (WSS)  │   │  │
│  │  │  (REST API)      │  │   - Connection Manager    │   │  │
│  │  │  - /api/v1/*     │  │   - User Identification   │   │  │
│  │  │  - Endpoints     │  │   - Message Routing       │   │  │
│  │  └──────────────────┘  └───────────────────────────┘   │  │
│  │                                                           │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │         Notification Manager                     │   │  │
│  │  │  - createUserNotification()                      │   │  │
│  │  │  - sendNotificationViaWebSocket()                │   │  │
│  │  │  - Delivery Status Tracking                      │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                               │                                │
│                    ┌──────────▼──────────┐                    │
│                    │   SQLite Database    │                    │
│                    │  - notifications     │                    │
│                    │  - user_fcm_tokens   │                    │
│                    └──────────────────────┘                    │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                   External Services                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               Firebase Cloud Services                    │  │
│  │  - Firebase Authentication                               │  │
│  │  - Firebase Cloud Messaging (FCM)                        │  │
│  │  - Firebase Firestore (User profiles)                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

#### Client Components

**NotificationSystem Class** (`user-system.js`)
- Manages WebSocket connection lifecycle
- Handles FCM token registration
- Maintains in-memory notification cache
- Renders notifications in UI
- Implements reconnection logic with exponential backoff

**Service Worker** (`firebase-messaging-sw.js`)
- Listens for background FCM messages
- Displays browser notifications when app is closed
- Handles notification click events
- Opens or focuses application on notification click

#### Server Components

**WebSocket Server**
- Maintains persistent connections with clients
- Tracks user-to-connection mapping
- Routes notifications to correct connections
- Handles connection lifecycle (open, close, error)

**Notification Manager**
- Creates notifications in database
- Determines delivery channel (WebSocket, FCM, both)
- Tracks delivery status
- Handles failed delivery attempts

## WebSocket Implementation

### Server-Side Implementation

**File**: `backend/server.js`

#### Initialization

```javascript
const http = require('http');
const WebSocket = require('ws');
const express = require('express');

const app = express();
const server = http.createServer(app);

// Create WebSocket server on same HTTP server
const wss = new WebSocket.Server({ 
  server, 
  path: '/ws' 
});

// Track user connections
const userConnections = new Map();

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket available at: ws://localhost:${PORT}/ws`);
});
```

#### Connection Handling

```javascript
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      switch(data.type) {
        case 'identify':
          // Store user connection
          userConnections.set(data.userId, ws);
          console.log(`User ${data.userId} connected via WebSocket`);
          
          // Send confirmation
          ws.send(JSON.stringify({
            type: 'connection_status',
            status: 'connected',
            userId: data.userId
          }));
          break;

        case 'notification_read':
          // Mark notification as read
          markNotificationAsRead(data.notificationId);
          break;

        case 'ping':
          // Respond to heartbeat
          ws.send(JSON.stringify({ type: 'pong' }));
          break;
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    // Remove connection on disconnect
    for (const [userId, connection] of userConnections.entries()) {
      if (connection === ws) {
        userConnections.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});
```

#### Notification Delivery

```javascript
function sendNotificationViaWebSocket(userId, notification) {
  const ws = userConnections.get(userId);
  
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'notification',
      data: notification
    }));
    
    console.log(`Notification sent via WebSocket to user ${userId}`);
    return true;
  }
  
  console.log(`User ${userId} not connected via WebSocket`);
  return false;
}
```

### Client-Side Implementation

**File**: `frontend/user-system.js`

#### WebSocket Connection

```javascript
class NotificationSystem {
  constructor() {
    this.notifications = [];
    this.unreadCount = 0;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.fcmToken = null;
  }

  initWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname === 'localhost' 
      ? 'localhost:3001' 
      : window.location.host;
    
    this.ws = new WebSocket(`${protocol}//${host}/ws`);

    this.ws.onopen = () => {
      console.log('WebSocket connected for real-time notifications');
      this.reconnectAttempts = 0;
      
      // Identify user
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.ws.send(JSON.stringify({
          type: 'identify',
          userId: userId
        }));
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        switch(message.type) {
          case 'notification':
            this.handleNotification(message.data);
            break;
          
          case 'connection_status':
            console.log('Connection confirmed:', message.status);
            break;
          
          case 'pong':
            // Heartbeat response received
            break;
        }
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.reconnectWebSocket();
    };
  }
}
```

#### Reconnection Logic

```javascript
reconnectWebSocket() {
  if (this.reconnectAttempts >= this.maxReconnectAttempts) {
    console.log('Max reconnection attempts reached. Using polling fallback.');
    this.startPollingFallback();
    return;
  }

  const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
  this.reconnectAttempts++;

  console.log(`Reconnecting WebSocket in ${delay}ms (attempt ${this.reconnectAttempts})`);

  setTimeout(() => {
    this.initWebSocket();
  }, delay);
}
```

#### Polling Fallback

```javascript
startPollingFallback() {
  console.log('Starting notification polling fallback');
  
  setInterval(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications?unread=true`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (data.notifications && data.notifications.length > 0) {
        data.notifications.forEach(notification => {
          this.handleNotification(notification);
        });
      }
    } catch (error) {
      console.error('Polling fallback error:', error);
    }
  }, 30000); // Poll every 30 seconds
}
```

## Firebase Cloud Messaging

### Server-Side Configuration

**File**: `frontend/firebase-messaging-sw.js`

```javascript
// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    tag: payload.data.notificationId,
    requireInteraction: true,
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification.tag);
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Focus existing window if available
        for (const client of clientList) {
          if (client.url.includes('dashboard') && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window if none exists
        if (clients.openWindow) {
          return clients.openWindow('/dashboard.html');
        }
      })
  );
});
```

### Client-Side FCM Integration

**File**: `frontend/user-system.js`

```javascript
async initFirebaseMessaging() {
  try {
    if (!('Notification' in window)) {
      console.log('Browser does not support notifications');
      return;
    }

    // Request permission
    let permission = Notification.permission;
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }

    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return;
    }

    // Get FCM token
    const messaging = getMessaging();
    this.fcmToken = await getToken(messaging, {
      vapidKey: 'YOUR_VAPID_PUBLIC_KEY'
    });

    console.log('FCM token obtained:', this.fcmToken);

    // Save token to backend
    await this.saveFCMToken(this.fcmToken);

    // Handle foreground messages
    onMessage(messaging, (payload) => {
      console.log('Received foreground message:', payload);
      this.handleNotification({
        id: payload.data.notificationId,
        type: payload.data.type,
        title: payload.notification.title,
        message: payload.notification.body,
        icon: payload.data.icon,
        color: payload.data.color,
        timestamp: new Date().toISOString()
      });
    });

  } catch (error) {
    console.error('FCM initialization error:', error);
  }
}

async saveFCMToken(token) {
  try {
    const userId = localStorage.getItem('userId');
    const response = await fetch(`${API_BASE_URL}/users/fcm-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ userId, fcmToken: token })
    });

    if (response.ok) {
      console.log('FCM token saved to backend');
    }
  } catch (error) {
    console.error('Error saving FCM token:', error);
  }
}
```

## Notification Flow

### Complete Notification Lifecycle

1. **Trigger Event**
   - Fraud report created
   - Report status updated
   - System announcement
   - Security alert

2. **Backend Processing**
   ```javascript
   function createUserNotification(userId, notification) {
     // Generate unique ID
     const notificationId = uuid.v4();
     
     // Insert into database
     db.run(`
       INSERT INTO notifications (id, user_id, type, title, message, icon, color, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
     `, [notificationId, userId, notification.type, notification.title, 
         notification.message, notification.icon, notification.color]);
     
     // Attempt WebSocket delivery
     const delivered = sendNotificationViaWebSocket(userId, {
       ...notification,
       id: notificationId
     });
     
     if (delivered) {
       console.log(`Notification ${notificationId} delivered via WebSocket`);
     } else {
       console.log(`User offline. Notification ${notificationId} queued for FCM`);
       // Future: Send via FCM to offline users
     }
   }
   ```

3. **Client Reception**
   - WebSocket message received
   - Notification parsed and validated
   - Added to in-memory notifications array
   - UI updated with new notification

4. **User Interaction**
   - Notification displayed in UI (toast)
   - Badge counter incremented
   - User clicks notification
   - Notification marked as read
   - Badge counter decremented

5. **Persistence**
   - Read status synced to backend
   - Database updated
   - State synchronized across devices

## Database Schema

### Notifications Table

```sql
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    fraud_report_id TEXT,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    read_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (fraud_report_id) REFERENCES fraud_reports(id) ON DELETE SET NULL
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_read_at ON notifications(read_at);
```

### FCM Tokens Table

```sql
CREATE TABLE IF NOT EXISTS user_fcm_tokens (
    user_id TEXT PRIMARY KEY,
    fcm_token TEXT NOT NULL,
    device_info TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## API Endpoints

### Get Notifications

```http
GET /api/v1/notifications?unread=true&limit=50
Authorization: Bearer {token}

Response: 200 OK
{
  "notifications": [...],
  "unreadCount": 5,
  "total": 50
}
```

### Mark as Read

```http
PUT /api/v1/notifications/{notificationId}/read
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "notificationId": "uuid",
  "readAt": "2024-10-24T10:30:00Z"
}
```

### Create Notification

```http
POST /api/v1/notifications/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "uuid",
  "type": "fraud_alert",
  "title": "New Fraud Alert",
  "message": "Suspicious activity detected",
  "icon": "warning",
  "color": "red"
}

Response: 201 Created
{
  "notificationId": "uuid",
  "deliveryStatus": "sent_via_websocket"
}
```

## Client Implementation

### Notification Display

```javascript
handleNotification(notification) {
  // Add to array
  this.notifications.unshift(notification);
  
  // Update unread count
  if (!notification.read_at) {
    this.unreadCount++;
    this.updateBadge();
  }
  
  // Show toast
  this.showToast(notification);
  
  // Render in notification center
  this.renderNotificationList();
}

showToast(notification) {
  const toast = document.createElement('div');
  toast.className = `toast ${notification.color || 'blue'}`;
  toast.innerHTML = `
    <span class="material-symbols-outlined">${notification.icon || 'info'}</span>
    <div>
      <strong>${notification.title}</strong>
      <p>${notification.message}</p>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 5000);
}

updateBadge() {
  const badge = document.getElementById('notification-badge');
  if (this.unreadCount > 0) {
    badge.textContent = this.unreadCount;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}
```

## Error Handling and Fallbacks

### WebSocket Connection Failures

1. **Automatic Reconnection**: Exponential backoff up to 5 attempts
2. **Polling Fallback**: After max attempts, switch to 30-second polling
3. **Error Logging**: All connection errors logged for debugging

### FCM Token Failures

1. **Browser Support Check**: Verify Notification API availability
2. **Permission Handling**: Gracefully handle denied permissions
3. **Token Refresh**: Automatically refresh expired tokens
4. **Fallback to WebSocket**: If FCM fails, rely on WebSocket only

### Network Failures

1. **Offline Detection**: Monitor `navigator.onLine` status
2. **Queue Messages**: Store notifications in localStorage when offline
3. **Sync on Reconnect**: Send queued notifications when connection restored

## Performance Considerations

### Connection Management

- **Connection Pooling**: Reuse WebSocket connections
- **Heartbeat Mechanism**: 30-second ping/pong to detect dead connections
- **Automatic Cleanup**: Remove stale connections after timeout
- **Rate Limiting**: Limit reconnection attempts to prevent server overload

### Message Optimization

- **Batch Notifications**: Group multiple notifications when appropriate
- **Compression**: Use WebSocket compression for large payloads
- **Selective Delivery**: Only send to relevant users
- **Priority Queuing**: Prioritize critical notifications

### Database Optimization

- **Indexes**: Added on user_id, created_at, read_at
- **Pagination**: Limit query results to prevent large result sets
- **Archiving**: Move old notifications to archive table (future)
- **Read Replicas**: Use read replicas for notification queries (production)

## Security

### WebSocket Security

- **Authentication**: Require user identification after connection
- **Authorization**: Verify user has access to requested notifications
- **Rate Limiting**: Limit messages per connection
- **Input Validation**: Validate all incoming messages
- **WSS in Production**: Use secure WebSocket (WSS) with TLS

### FCM Security

- **VAPID Keys**: Use application server keys for authentication
- **Token Security**: Never expose FCM tokens in client-side code
- **Permission Verification**: Always check notification permissions
- **Token Rotation**: Regularly rotate FCM tokens

### Data Security

- **Sensitive Data**: Never include sensitive data in notifications
- **Encryption**: Encrypt notification data in transit (HTTPS/WSS)
- **Access Control**: Users can only access their own notifications
- **Audit Logging**: Log all notification access and modifications

## Testing

### Unit Tests

```javascript
// Test WebSocket connection
describe('WebSocket Connection', () => {
  it('should connect successfully', (done) => {
    const ws = new WebSocket('ws://localhost:3001/ws');
    ws.onopen = () => {
      expect(ws.readyState).toBe(WebSocket.OPEN);
      ws.close();
      done();
    };
  });

  it('should receive identification confirmation', (done) => {
    const ws = new WebSocket('ws://localhost:3001/ws');
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'identify', userId: 'test-user' }));
    };
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      expect(message.type).toBe('connection_status');
      expect(message.status).toBe('connected');
      ws.close();
      done();
    };
  });
});
```

### Integration Tests

```javascript
// Test notification delivery
describe('Notification Delivery', () => {
  it('should deliver notification via WebSocket', async () => {
    // Create notification
    const response = await fetch('http://localhost:3001/api/v1/notifications/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: 'test-user',
        type: 'test',
        title: 'Test Notification',
        message: 'Test message'
      })
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.deliveryStatus).toBe('sent_via_websocket');
  });
});
```

### Manual Testing Checklist

- [ ] WebSocket connects on page load
- [ ] User identification works correctly
- [ ] Notifications appear in real-time
- [ ] Badge counter updates correctly
- [ ] Mark as read functionality works
- [ ] Reconnection works after disconnect
- [ ] Polling fallback activates after max attempts
- [ ] FCM permission request appears
- [ ] FCM token is saved to backend
- [ ] Push notifications work when tab closed
- [ ] Notification click opens/focuses app
- [ ] Multiple devices receive notifications
- [ ] Notifications persist across page reloads

---

**Document Version**: 1.0.0
**Last Updated**: October 2024
**Maintained By**: Sentinela PIX Development Team
