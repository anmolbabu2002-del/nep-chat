# 🚀 Production-Ready Chat App

A modern, real-time chat application built with **production-grade architecture**. Features persistent sessions, multi-server clustering, health monitoring, and enterprise-ready deployment options.

## ✨ Production Features

### 🔐 Enterprise Authentication
- **Redis-powered persistent sessions** (survive server restarts)
- Username/password authentication (Firebase optional)
- Secure session management across multiple servers
- Automatic session cleanup and validation

### 💬 Advanced Chat Features
- **Real-time messaging** with Socket.IO clustering
- **Multi-server support** with Redis adapter
- Message persistence with PostgreSQL
- File sharing with cloud storage support
- Message status tracking (sent/delivered/read)
- Typing indicators and read receipts

### 🏗️ Production Architecture
- **Load balancer ready** (Nginx/HAProxy configs included)
- **Health monitoring** with automatic client reconnection
- **Database clustering** with PostgreSQL
- **Session clustering** with Redis
- **Auto-scaling support** for millions of users

### 🔒 Enterprise Security
- **SSL/TLS encryption** ready
- **CORS protection** with configurable origins
- **Input validation** and SQL injection prevention
- **Rate limiting** ready for implementation
- **Audit logging** for security monitoring

### 📊 Monitoring & Observability
- **Health check endpoints** (`/health`)
- **Real-time connection monitoring**
- **Server status broadcasting**
- **Performance metrics** collection
- **Graceful shutdown** handling

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Socket.IO Client for real-time communication
- Responsive design with modern CSS
- Progressive Web App ready

### Backend
- **Node.js + Express** with clustering support
- **Socket.IO** with Redis adapter for multi-server
- **PostgreSQL** for shared database
- **Redis** for sessions and caching
- **Docker** containerization

### Infrastructure
- **Nginx/HAProxy** load balancing
- **Docker Compose** for local development
- **Health checks** and monitoring
- **SSL termination** support

## Project Structure

```
a real chat app/
├── package.json                 # Dependencies and scripts
├── server.js                    # Main server file
├── firebase-config.js          # Firebase configuration
├── styles.css                   # WhatsApp-style CSS
├── index.html                   # Legacy entry (redirects to login)
├── login.html                   # Phone number login page
├── otp.html                     # OTP verification page
├── users.html                   # User search and recent chats
├── chat.html                    # Private chat interface
├── chat.js                      # Legacy file (deprecated)
└── README.md                    # This file
```

## Setup Instructions

### 1. Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase project

### 2. Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication → Phone Auth

2. **Get Firebase Config**
   - Project Settings → General → Your apps
   - Add Web App
   - Copy the Firebase configuration object

3. **Generate Service Account Key**
   - Project Settings → Service accounts
   - Click "Generate new private key"
   - Download the JSON file

### 3. Configure the Application

1. **Update Firebase Configuration**
   
   Edit `firebase-config.js` and replace with your actual config:
   ```javascript
   const FIREBASE_CONFIG = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

2. **Update Server Configuration**
   
   Edit `server.js` and replace the service account configuration:
   ```javascript
   const serviceAccount = {
     "type": "service_account",
     "project_id": "your-project-id",
     "private_key": "-----BEGIN PRIVATE KEY-----\nYour-Private-Key\n-----END PRIVATE KEY-----\n",
     "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
     "client_id": "your-client-id"
   };
   ```

3. **Update Firebase Config in HTML Files**
   
   Replace the placeholder config in `login.html`, `otp.html`, `users.html`, and `chat.html`:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

### 4. Install Dependencies

```bash
cd "a real chat app"
npm install
```

### 5. Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

## Usage

### 1. First Time Setup
1. Open `http://localhost:3000` in your browser
2. Enter your name and phone number
3. Click "Send OTP"
4. Enter the 6-digit OTP sent to your phone
5. You'll be redirected to the users page

### 2. Finding and Chatting with Users
1. On the users page, search for users by phone number
2. Click "Chat" next to a user to start a conversation
3. Send messages in real-time
4. Recent chats are saved for quick access

### 3. Navigation Flow
- `login.html` → Phone number entry
- `otp.html` → OTP verification
- `users.html` → User search and recent chats
- `chat.html` → Private chat interface

## API Endpoints

### Authentication
- Firebase handles all authentication

### User Management
- `POST /api/users/profile` - Save user profile
- `GET /api/users/search/:phone` - Search user by phone
- `GET /api/users` - Get all users

### Socket.IO Events
- `joinChat` - Join a private chat room
- `sendMessage` - Send a message
- `typing` - User is typing
- `stopTyping` - User stopped typing
- `receiveMessage` - Receive a message
- `userTyping` - Typing indicator
- `userStopTyping` - Stop typing indicator

## Security Features

### Authentication
- Firebase Phone Auth with OTP
- Token-based Socket.IO authentication
- Session management with localStorage

### Data Validation
- Input sanitization on all forms
- Phone number format validation
- OTP length validation

### Socket.IO Security
- Authentication middleware
- UID-based room management
- Secure message routing

## Production Considerations

### Database
- Replace in-memory storage with MongoDB/PostgreSQL
- Implement proper user persistence
- Add message history storage

### Scaling
- Add Redis for Socket.IO scaling
- Implement load balancing
- Add proper error handling

### Security
- Add rate limiting
- Implement proper logging
- Add HTTPS configuration

## Troubleshooting

### Common Issues

1. **Firebase Authentication Errors**
   - Check Firebase configuration
   - Verify phone auth is enabled
   - Check service account key

2. **Socket.IO Connection Issues**
   - Verify Firebase tokens
   - Check CORS configuration
   - Ensure server is running

3. **OTP Not Received**
   - Check phone number format
   - Verify Firebase phone auth quota
   - Check reCAPTCHA configuration

### Debug Mode
Enable console logging in browser dev tools to see detailed error messages.

## 🚀 Deployment Guide

### Quick Start (Docker)
```bash
# 1. Clone and setup
git clone <your-repo>
cd chat-app

# 2. Configure environment
cp env.example .env
# Edit .env with your production values

# 3. Start with Docker Compose (includes load balancer)
docker-compose up -d

# 4. Access your app
# Frontend: http://localhost
# Load Balancer Stats: http://localhost/stats (HAProxy)
# Health Check: http://localhost/health
```

### Manual Deployment

#### 1. Setup Infrastructure
```bash
# Install dependencies
npm install

# Setup PostgreSQL database
psql -U postgres -c "CREATE DATABASE chatapp;"
psql -U postgres -d chatapp -f database-schema.sql

# Setup Redis
redis-server  # or use Docker: docker run -d -p 6379:6379 redis:alpine
```

#### 2. Environment Configuration
```bash
cp env.example .env
# Required variables:
# DATABASE_URL=postgresql://user:pass@localhost:5432/chatapp
# REDIS_URL=redis://localhost:6379
# SESSION_SECRET=your-secure-secret
```

#### 3. Database Migration
```bash
# If migrating from existing SQLite data
node migrate-to-postgres.js
```

#### 4. Start the Application
```bash
npm start
```

### Load Balancing Setup

#### Using Nginx
```bash
# Copy nginx.conf to /etc/nginx/sites-available/
sudo cp nginx.conf /etc/nginx/sites-available/chat-app
sudo ln -s /etc/nginx/sites-available/chat-app /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

#### Using HAProxy
```bash
# Copy haproxy.cfg to /etc/haproxy/
sudo cp haproxy.cfg /etc/haproxy/haproxy.cfg
sudo systemctl restart haproxy
```

### Multi-Server Deployment
```bash
# Start multiple instances on different ports
PORT=3001 REDIS_URL=redis://redis-server:6379 npm start &
PORT=3002 REDIS_URL=redis://redis-server:6379 npm start &
PORT=3003 REDIS_URL=redis://redis-server:6379 npm start &

# Configure load balancer to distribute traffic
```

### Production Checklist
- [ ] Set strong SESSION_SECRET
- [ ] Configure SSL certificates
- [ ] Setup database backups
- [ ] Configure firewall rules
- [ ] Setup monitoring (Prometheus/Grafana)
- [ ] Configure log aggregation
- [ ] Test load balancing
- [ ] Setup auto-scaling rules

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Firebase documentation
3. Create an issue in the repository

---

**Note**: This is a demonstration application. For production use, implement proper database persistence, enhanced security measures, and thorough testing.
