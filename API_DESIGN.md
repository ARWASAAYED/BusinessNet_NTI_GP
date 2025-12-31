# 🌐 API Design & Endpoints Documentation

## Base URL
```
Development: http://localhost:5000/api/v1
Production: https://api.yourdomain.com/api/v1
```

---

## 🔐 Authentication

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "SecurePass123!",
  "role": "user" // or "business"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token_here"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "token": "new_jwt_token"
  }
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 👤 User Management

### Get Current User
```http
GET /users/me
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "bio": "...",
    "avatar": "url",
    "role": "user",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

### Update Profile
```http
PATCH /users/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullName": "John Updated",
  "bio": "New bio",
  "avatar": "new_avatar_url"
}

Response: 200 OK
```

### Get User by ID
```http
GET /users/:userId

Response: 200 OK
```

### Search Users
```http
GET /users/search?q=john&limit=10&page=1

Response: 200 OK
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "total": 50,
      "page": 1,
      "pages": 5
    }
  }
}
```

---

## 🏢 Business Management

### Create Business Profile
```http
POST /businesses
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Tech Solutions Inc",
  "description": "We provide tech solutions",
  "website": "https://techsolutions.com",
  "type": "enum(startup, small, medium, enterprise)",
  "category": "Technology",
  "location": "New York, USA"
}

Response: 201 Created
```

### Get Business Profile
```http
GET /businesses/:businessId

Response: 200 OK
{
  "success": true,
  "data": {
    "_id": "business_id",
    "name": "Tech Solutions Inc",
    "description": "...",
    "reputationScore": 85.5,
    "verified": true,
    "followers": 1250,
    "posts": 45
  }
}
```

### Update Business Profile
```http
PATCH /businesses/:businessId
Authorization: Bearer {token}

Response: 200 OK
```

### Get Business Analytics
```http
GET /businesses/:businessId/analytics
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "views": 5000,
    "engagement": 12.5,
    "followers": 1250,
    "growthRate": 5.2,
    "topPosts": [...]
  }
}
```

---

## 📝 Post Management

### Create Post
```http
POST /posts
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "content": "Check out our new product!",
  "category": "Technology",
  "businessId": "business_id", // optional
  "media": [file1, file2], // optional
  "hashtags": ["tech", "innovation"]
}

Response: 201 Created
```

### Get Feed
```http
GET /posts/feed?page=1&limit=20
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "posts": [
      {
        "_id": "post_id",
        "author": { ... },
        "business": { ... },
        "content": "...",
        "media": [...],
        "likes": 125,
        "comments": 45,
        "shares": 12,
        "isLiked": true,
        "createdAt": "..."
      }
    ],
    "pagination": { ... }
  }
}
```

### Get Post by ID
```http
GET /posts/:postId

Response: 200 OK
```

### Update Post
```http
PATCH /posts/:postId
Authorization: Bearer {token}

{
  "content": "Updated content"
}

Response: 200 OK
```

### Delete Post
```http
DELETE /posts/:postId
Authorization: Bearer {token}

Response: 204 No Content
```

### Like/Unlike Post
```http
POST /posts/:postId/like
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "isLiked": true,
    "likesCount": 126
  }
}
```

### Share Post
```http
POST /posts/:postId/share
Authorization: Bearer {token}

Response: 201 Created
```

---

## 💬 Comment Management

### Create Comment
```http
POST /posts/:postId/comments
Authorization: Bearer {token}

{
  "content": "Great post!",
  "parentId": "comment_id" // optional for nested comments
}

Response: 201 Created
```

### Get Comments
```http
GET /posts/:postId/comments?page=1&limit=20

Response: 200 OK
{
  "success": true,
  "data": {
    "comments": [
      {
        "_id": "comment_id",
        "author": { ... },
        "content": "Great post!",
        "likes": 5,
        "replies": 2,
        "createdAt": "..."
      }
    ]
  }
}
```

### Update Comment
```http
PATCH /comments/:commentId
Authorization: Bearer {token}

Response: 200 OK
```

### Delete Comment
```http
DELETE /comments/:commentId
Authorization: Bearer {token}

Response: 204 No Content
```

### Like Comment
```http
POST /comments/:commentId/like
Authorization: Bearer {token}

Response: 200 OK
```

---

## 👥 Community Management

### Create Community
```http
POST /communities
Authorization: Bearer {token}

{
  "name": "Tech Entrepreneurs",
  "description": "A community for tech entrepreneurs",
  "category": "Technology",
  "privacy": "public" // or "private"
}

Response: 201 Created
```

### Get Communities
```http
GET /communities?category=Technology&page=1&limit=20

Response: 200 OK
```

### Get Community Details
```http
GET /communities/:communityId

Response: 200 OK
{
  "success": true,
  "data": {
    "_id": "community_id",
    "name": "Tech Entrepreneurs",
    "description": "...",
    "members": 1250,
    "posts": 450,
    "isMember": true,
    "role": "member" // or "admin", "moderator"
  }
}
```

### Join Community
```http
POST /communities/:communityId/join
Authorization: Bearer {token}

Response: 200 OK
```

### Leave Community
```http
POST /communities/:communityId/leave
Authorization: Bearer {token}

Response: 200 OK
```

### Get Community Posts
```http
GET /communities/:communityId/posts?page=1&limit=20

Response: 200 OK
```

### Manage Members (Admin only)
```http
PATCH /communities/:communityId/members/:userId
Authorization: Bearer {token}

{
  "role": "moderator" // or "member", "remove"
}

Response: 200 OK
```

---

## 💌 Messaging

### Get Conversations
```http
GET /messages/conversations
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "conversationId": "conv_id",
      "participant": { ... },
      "lastMessage": { ... },
      "unreadCount": 3,
      "updatedAt": "..."
    }
  ]
}
```

### Get Messages
```http
GET /messages/conversations/:userId?page=1&limit=50
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "messages": [
      {
        "_id": "message_id",
        "sender": { ... },
        "receiver": { ... },
        "content": "Hello!",
        "isRead": false,
        "createdAt": "..."
      }
    ]
  }
}
```

### Send Message
```http
POST /messages
Authorization: Bearer {token}

{
  "receiverId": "user_id",
  "content": "Hello there!",
  "media": "url" // optional
}

Response: 201 Created
```

### Mark as Read
```http
PATCH /messages/:messageId/read
Authorization: Bearer {token}

Response: 200 OK
```

---

## 🔔 Notifications

### Get Notifications
```http
GET /notifications?page=1&limit=20
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "notif_id",
        "type": "like", // comment, follow, message, etc.
        "userId": { ... },
        "referenceId": "post_id",
        "isRead": false,
        "createdAt": "..."
      }
    ],
    "unreadCount": 5
  }
}
```

### Mark as Read
```http
PATCH /notifications/:notificationId/read
Authorization: Bearer {token}

Response: 200 OK
```

### Mark All as Read
```http
PATCH /notifications/read-all
Authorization: Bearer {token}

Response: 200 OK
```

---

## 📊 Trends

### Get Trending Topics
```http
GET /trends?limit=10

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "_id": "trend_id",
      "keyword": "#AI",
      "category": "Technology",
      "velocity": 125.5,
      "sentiment": "positive",
      "postCount": 450,
      "growthRate": 15.2
    }
  ]
}
```

### Get Trend Details
```http
GET /trends/:trendId

Response: 200 OK
```

### Get Posts by Trend
```http
GET /trends/:trendId/posts?page=1&limit=20

Response: 200 OK
```

---

## 🏆 Badges & Gamification

### Get User Badges
```http
GET /users/:userId/badges

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "_id": "badge_id",
      "name": "Early Adopter",
      "description": "Joined in the first month",
      "imageUrl": "...",
      "rarity": "enum(common, rare, epic, legendary)",
      "earnedAt": "..."
    }
  ]
}
```

### Get Available Badges
```http
GET /badges

Response: 200 OK
```

---

## 📢 Promoted Posts

### Create Promotion
```http
POST /promotions
Authorization: Bearer {token}

{
  "postId": "post_id",
  "budget": 100.00,
  "duration": 7, // days
  "targetRegion": "US",
  "targetCategory": "Technology"
}

Response: 201 Created
```

### Get Promotion Analytics
```http
GET /promotions/:promotionId/analytics
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "impressions": 5000,
    "clicks": 250,
    "ctr": 5.0,
    "conversions": 15,
    "spent": 45.50,
    "remaining": 54.50
  }
}
```

---

## 🔍 Search

### Global Search
```http
GET /search?q=technology&type=all&page=1&limit=20
// type: all, users, businesses, posts, communities

Response: 200 OK
{
  "success": true,
  "data": {
    "users": [...],
    "businesses": [...],
    "posts": [...],
    "communities": [...]
  }
}
```

---

## 📤 File Upload

### Upload Media
```http
POST /upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "file": file,
  "type": "image" // or "video", "document"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "url": "https://cdn.example.com/image.jpg",
    "publicId": "cloudinary_id",
    "type": "image"
  }
}
```

---

## 🔌 WebSocket Events

### Connection
```javascript
// Client connects
socket.emit('authenticate', { token: 'jwt_token' });

// Server response
socket.on('authenticated', { userId: 'user_id' });
```

### Real-time Messaging
```javascript
// Send message
socket.emit('send_message', {
  receiverId: 'user_id',
  content: 'Hello!'
});

// Receive message
socket.on('new_message', {
  _id: 'message_id',
  sender: { ... },
  content: 'Hello!',
  createdAt: '...'
});

// Typing indicator
socket.emit('typing', { receiverId: 'user_id' });
socket.on('user_typing', { userId: 'user_id' });
```

### Real-time Notifications
```javascript
socket.on('new_notification', {
  _id: 'notif_id',
  type: 'like',
  userId: { ... },
  referenceId: 'post_id'
});
```

### Online Status
```javascript
socket.on('user_online', { userId: 'user_id' });
socket.on('user_offline', { userId: 'user_id' });
```

---

## 📋 Response Format Standards

### Success Response
```json
{
  "success": true,
  "message": "Optional success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... } // optional
  }
}
```

### Pagination
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "pages": 10,
      "limit": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

## 🔒 Authentication Headers

All protected endpoints require:
```
Authorization: Bearer {jwt_token}
```

---

## ⚡ Rate Limiting

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **File Upload**: 10 requests per hour
- **Search**: 30 requests per minute

---

## 📝 Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `204 No Content` - Success with no response body
- `400 Bad Request` - Invalid request
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict
- `422 Unprocessable Entity` - Validation error
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

**Version**: 1.0  
**Last Updated**: 2025-12-29
