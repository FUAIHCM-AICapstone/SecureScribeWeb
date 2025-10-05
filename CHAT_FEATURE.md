# Chat Feature Documentation

## Overview

The Chat feature implements a **1-on-1 conversational AI system** where users can have multiple conversation threads with a system bot. This is fundamentally different from multi-user chat systems - each conversation is private between one user and the AI assistant.

### Key Characteristics

- **User-Bot Only**: Conversations are exclusively between individual users and the system AI
- **Multiple Conversations**: Users can create and manage multiple conversation threads
- **Independent**: Conversations are not tied to projects, meetings, or other entities
- **Contextual @Mentions**: Users can reference existing meetings, projects, and files for context
- **Real-time Communication**: WebSocket-based instant messaging
- **Persistent History**: All conversations and messages retained indefinitely
- **Separate Search**: Dedicated search system for chat content

## Architecture

### System Context

The chat system operates as an independent module within the SecureScribe ecosystem, focusing on AI-assisted productivity and information retrieval rather than team collaboration.

```
┌─────────────────────────────────────────────────────────────┐
│                    SecureScribe Platform                    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Users     │  │  Projects   │  │  Meetings   │         │
│  │ Management  │  │ Management  │  │ Management  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│              ┌─────────────────────────────────────┐        │
│              │           Chat System              │        │
│              │  (1-on-1 User-Bot Conversations)   │        │
│              └─────────────────────────────────────┘        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Search    │  │Notifications│  │ Real-time   │         │
│  │   Engine    │  │   System    │  │  WebSocket  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

### Core Tables

#### 1. Conversations (`conversations`)

**Purpose**: Stores user-created conversation threads

| Field         | Type         | Description                              |
| ------------- | ------------ | ---------------------------------------- |
| `id`          | UUID         | Primary Key                              |
| `user_id`     | UUID         | Foreign Key → users (conversation owner) |
| `name`        | VARCHAR(255) | User-defined conversation name           |
| `created_at`  | TIMESTAMP    | Creation timestamp                       |
| `updated_at`  | TIMESTAMP    | Last activity timestamp                  |
| `is_archived` | BOOLEAN      | Archive flag (default: false)            |

**Indexes:**

- `user_id` (for user's conversations)
- `updated_at` (for sorting by recency)

#### 2. Messages (`messages`)

**Purpose**: Stores individual messages in conversations

| Field             | Type      | Description                                 |
| ----------------- | --------- | ------------------------------------------- |
| `id`              | UUID      | Primary Key                                 |
| `conversation_id` | UUID      | Foreign Key → conversations                 |
| `user_id`         | UUID      | Foreign Key → users (message sender)        |
| `role`            | ENUM      | 'user' or 'assistant'                       |
| `content`         | TEXT      | Message content (supports markdown)         |
| `timestamp`       | TIMESTAMP | Message timestamp                           |
| `is_edited`       | BOOLEAN   | Whether message was edited (default: false) |
| `edited_at`       | TIMESTAMP | Edit timestamp (nullable)                   |

**Indexes:**

- `conversation_id, timestamp` (for conversation message history)
- `user_id` (for user's messages across conversations)

#### 3. Message Mentions (`message_mentions`)

**Purpose**: Stores @mentions within messages linking to existing entities

| Field          | Type         | Description                             |
| -------------- | ------------ | --------------------------------------- |
| `id`           | UUID         | Primary Key                             |
| `message_id`   | UUID         | Foreign Key → messages                  |
| `entity_type`  | ENUM         | 'meeting', 'project', 'file'            |
| `entity_id`    | UUID         | Foreign Key to respective entity        |
| `entity_name`  | VARCHAR(255) | Cached entity name for display          |
| `offset_start` | INTEGER      | Character offset in message content     |
| `offset_end`   | INTEGER      | Character offset end in message content |

**Indexes:**

- `message_id` (for mentions in a message)
- `entity_type, entity_id` (for reverse lookups)

### Supporting Tables (Existing)

The chat system leverages existing tables for @mention functionality:

- **users**: For user information and authentication
- **meetings**: For @meeting mentions
- **projects**: For @project mentions
- **files**: For @file mentions

## API Endpoints

### Conversation Management

#### GET `/api/chat/conversations`

**Purpose**: Retrieve user's conversations with pagination

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Filter by conversation name

**Response:**

```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "uuid",
        "name": "Project Planning",
        "message_count": 15,
        "last_activity": "2025-01-15T10:30:00Z",
        "created_at": "2025-01-10T09:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "total_pages": 1,
      "has_next": false,
      "has_prev": false
    }
  }
}
```

#### POST `/api/chat/conversations`

**Purpose**: Create a new conversation

**Request Body:**

```json
{
  "name": "New Conversation",
  "initial_message": "Hello, I need help with..."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "New Conversation",
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

#### GET `/api/chat/conversations/{conversation_id}`

**Purpose**: Get specific conversation details

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Project Planning",
    "message_count": 15,
    "created_at": "2025-01-10T09:00:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
}
```

#### PUT `/api/chat/conversations/{conversation_id}`

**Purpose**: Update conversation (rename)

**Request Body:**

```json
{
  "name": "Updated Conversation Name"
}
```

#### DELETE `/api/chat/conversations/{conversation_id}`

**Purpose**: Delete conversation and all messages

**Response:**

```json
{
  "success": true,
  "message": "Conversation deleted successfully"
}
```

### Message Management

#### GET `/api/chat/conversations/{conversation_id}/messages`

**Purpose**: Retrieve messages in a conversation

**Query Parameters:**

- `before_message_id` (optional): Pagination cursor
- `limit` (optional): Messages per page (default: 50)

**Response:**

```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "uuid",
        "conversation_id": "uuid",
        "user_id": "uuid",
        "role": "user",
        "content": "Hello, how can you help?",
        "timestamp": "2025-01-15T10:30:00Z",
        "is_edited": false,
        "mentions": [
          {
            "entity_type": "project",
            "entity_id": "uuid",
            "entity_name": "Project Alpha",
            "offset_start": 10,
            "offset_end": 22
          }
        ]
      },
      {
        "id": "uuid",
        "conversation_id": "uuid",
        "user_id": "uuid",
        "role": "assistant",
        "content": "I can help you with Project Alpha...",
        "timestamp": "2025-01-15T10:30:05Z",
        "is_edited": false,
        "mentions": []
      }
    ],
    "pagination": {
      "has_more": true,
      "next_cursor": "message_id"
    }
  }
}
```

#### POST `/api/chat/conversations/{conversation_id}/messages`

**Purpose**: Send a new message

**Request Body:**

```json
{
  "content": "Hello! @project:Project Alpha @meeting:Meeting-123",
  "mentions": [
    {
      "entity_type": "project",
      "entity_id": "uuid",
      "offset_start": 8,
      "offset_end": 20
    },
    {
      "entity_type": "meeting",
      "entity_id": "uuid",
      "offset_start": 21,
      "offset_end": 33
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user_message": {
      "id": "uuid",
      "conversation_id": "uuid",
      "role": "user",
      "content": "Hello! @project:Project Alpha @meeting:Meeting-123",
      "timestamp": "2025-01-15T10:30:00Z",
      "mentions": [...]
    },
    "ai_message": {
      "id": "uuid",
      "conversation_id": "uuid",
      "role": "assistant",
      "content": "I understand you're working on Project Alpha...",
      "timestamp": "2025-01-15T10:30:05Z",
      "mentions": []
    }
  }
}
```

#### PUT `/api/chat/messages/{message_id}`

**Purpose**: Edit a user message

**Request Body:**

```json
{
  "content": "Updated message content",
  "mentions": [...]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "content": "Updated message content",
    "edited_at": "2025-01-15T10:35:00Z"
  }
}
```

#### DELETE `/api/chat/messages/{message_id}`

**Purpose**: Delete a message

**Response:**

```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

### @Mentions Search

#### GET `/api/chat/mentions/search`

**Purpose**: Search for entities to mention

**Query Parameters:**

- `q`: Search query
- `types`: Comma-separated entity types (meeting,project,file)
- `limit`: Max results (default: 8)

**Response:**

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "entity_type": "project",
        "entity_id": "uuid",
        "name": "Project Alpha",
        "subtitle": "Core development project"
      },
      {
        "entity_type": "meeting",
        "entity_id": "uuid",
        "name": "Sprint Planning",
        "subtitle": "2025-01-15 09:00"
      }
    ]
  }
}
```

## WebSocket Events

### Connection

**Endpoint:** `ws://localhost:8000/api/chat/ws`

**Authentication:** Include JWT token in query parameters or headers

### Events

#### Client → Server

**send_message**

```json
{
  "type": "send_message",
  "conversation_id": "uuid",
  "content": "Hello!",
  "mentions": [...]
}
```

**typing_start**

```json
{
  "type": "typing_start",
  "conversation_id": "uuid"
}
```

**typing_stop**

```json
{
  "type": "typing_stop",
  "conversation_id": "uuid"
}
```

#### Server → Client

**message_received**

```json
{
  "type": "message_received",
  "conversation_id": "uuid",
  "message": {
    "id": "uuid",
    "role": "assistant",
    "content": "AI response...",
    "timestamp": "2025-01-15T10:30:05Z"
  }
}
```

**typing_indicator**

```json
{
  "type": "typing_indicator",
  "conversation_id": "uuid",
  "is_typing": true
}
```

**conversation_updated**

```json
{
  "type": "conversation_updated",
  "conversation_id": "uuid",
  "updated_at": "2025-01-15T10:30:05Z"
}
```

## Search Integration

### Dedicated Chat Search

#### GET `/api/chat/search`

**Purpose**: Search within chat messages

**Query Parameters:**

- `q`: Search query
- `conversation_id` (optional): Limit to specific conversation
- `date_from` (optional): Start date filter
- `date_to` (optional): End date filter
- `page` (optional): Page number
- `limit` (optional): Results per page

**Response:**

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "message_id": "uuid",
        "conversation_id": "uuid",
        "conversation_name": "Project Planning",
        "content": "Hello! I need help with @project:Project Alpha",
        "timestamp": "2025-01-15T10:30:00Z",
        "role": "user",
        "highlights": [
          {"content": "Project Alpha", "type": "mention"}
        ]
      }
    ],
    "pagination": {...}
  }
}
```

## Notification System

### Chat Notifications

The notification system triggers for:

- All AI assistant messages in user's conversations
- @mentions in messages (if configured)

#### POST `/api/notifications/chat`

**Purpose**: Send chat notification

**Request Body:**

```json
{
  "user_id": "uuid",
  "conversation_id": "uuid",
  "message_id": "uuid",
  "type": "chat_message",
  "title": "New AI Response",
  "message": "You have a new message in Project Planning conversation"
}
```

## Frontend Integration

### Current Implementation Status

The existing frontend (`components/chat/`) already implements:

- ✅ Conversation management UI
- ✅ Message input with @mentions
- ✅ Real-time message display
- ✅ Conversation tabs and navigation
- ✅ Rich text editing with markdown support

### Backend Integration Points

**1. Replace Mock API**

- Replace `services/api/chat.ts` with real API calls
- Update API base URL configuration

**2. WebSocket Integration**

- Add WebSocket client for real-time messaging
- Handle connection states and reconnection

**3. Authentication**

- Include JWT tokens in API requests
- Handle token refresh for long conversations

**4. @Mentions Backend**

- Connect mention search to real entity data
- Implement mention preview functionality

## Implementation Strategy

### Phase 1: Basic Chat API (Week 1-2)

1. **Database Migration**

   ```sql
   -- Create new tables
   CREATE TABLE conversations (...);
   CREATE TABLE messages (...);
   CREATE TABLE message_mentions (...);
   ```

2. **Basic CRUD Endpoints**
   - Conversation management endpoints
   - Message CRUD operations
   - Basic pagination

3. **Authentication Integration**
   - JWT token validation
   - User context in requests

### Phase 2: Real-time Features (Week 3-4)

1. **WebSocket Implementation**
   - Message broadcasting
   - Typing indicators
   - Connection management

2. **Frontend Integration**
   - Replace mock API calls
   - WebSocket client implementation
   - Error handling and reconnection

### Phase 3: Advanced Features (Week 5-6)

1. **@Mentions Enhancement**
   - Entity search integration
   - Preview functionality
   - Rich mention display

2. **Search System**
   - Chat-specific search index
   - Message content indexing
   - Search API implementation

3. **Notification Integration**
   - Chat notification triggers
   - User preference handling

### Phase 4: Polish & Testing (Week 7-8)

1. **Performance Optimization**
   - Message pagination
   - Search performance
   - WebSocket optimization

2. **Testing**
   - Unit tests for API endpoints
   - Integration tests for WebSocket
   - End-to-end chat flow testing

3. **Documentation**
   - API documentation updates
   - Frontend integration guides

## Data Migration

### Existing Mock Data

The current implementation uses mock data stored in memory. For production deployment:

1. **Export Strategy**: Create migration scripts to export mock conversations if needed
2. **Clean Slate**: Start fresh with new database tables
3. **User Communication**: Notify users about the transition to persistent chat

## Security Considerations

### Authentication & Authorization

- **JWT Validation**: All chat endpoints require valid JWT tokens
- **User Isolation**: Users can only access their own conversations
- **Message Integrity**: Prevent message tampering and ensure audit trails

### Content Security

- **XSS Prevention**: Sanitize message content
- **CSRF Protection**: Implement CSRF tokens for state-changing operations
- **Rate Limiting**: Prevent spam and abuse

### Data Privacy

- **Message Encryption**: Consider encrypting stored messages
- **Retention Policy**: Implement data retention as per GDPR requirements
- **Access Logging**: Log all chat access for audit purposes

## Performance Considerations

### Database Optimization

- **Indexes**: Ensure proper indexing on frequently queried columns
- **Pagination**: Implement efficient cursor-based pagination
- **Caching**: Cache frequently accessed conversations and recent messages

### Real-time Performance

- **WebSocket Scaling**: Consider Redis adapter for horizontal scaling
- **Message Broadcasting**: Optimize message delivery to connected clients
- **Connection Limits**: Implement connection pooling and limits

## Monitoring & Analytics

### Key Metrics

- **Message Volume**: Messages sent per day/hour
- **Conversation Activity**: Active conversations and user engagement
- **Response Times**: AI response latency and user experience
- **Error Rates**: API and WebSocket error rates

### Logging

- **User Actions**: Conversation creation, message sending, deletions
- **System Events**: WebSocket connections, disconnections, errors
- **Performance**: Slow queries, high latency operations

This documentation provides a comprehensive foundation for implementing the chat feature. The 1-on-1 user-bot architecture simplifies many aspects compared to multi-user chat systems while maintaining rich functionality for AI-assisted productivity.

