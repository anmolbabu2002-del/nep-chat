const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Initialize App
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// Database Setup
const dbPath = path.join(__dirname, 'chatapp.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('❌ Database connection error:', err.message);
    else console.log('✅ Connected to SQLite database');
});

// Initialize Schema
const schemaPath = path.join(__dirname, 'database-schema.sql');
if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema, (err) => {
        if (err) console.error('❌ Schema initialization failed:', err.message);
        else console.log('✅ Database schema verified');
    });
}

// Helpers
const generateId = () => crypto.randomBytes(16).toString('hex');

// Routes

const multer = require('multer');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

// Constants
const AGORA_APP_ID = 'fb538bf94ff64dda8e49b9e1fc6c39e0';
const AGORA_APP_CERTIFICATE = 'e6fba1a1e2604fb69ba2e0bacf5283a9';

// File Upload Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Serve Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes

// Upload Endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, fileUrl: fileUrl, filename: req.file.filename, mimetype: req.file.mimetype });
});

// Profile Picture Upload Endpoint
app.post('/api/profile/upload', upload.single('profile_pic'), (req, res) => {
    const sessionId = req.headers['x-session-id'];
    if (!sessionId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    db.get('SELECT uid FROM sessions WHERE session_id = ?', [sessionId], (err, session) => {
        if (!session) return res.status(401).json({ success: false, error: 'Invalid session' });
        if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });

        const fileUrl = `/uploads/${req.file.filename}`;
        db.run('UPDATE users SET profile_pic = ? WHERE uid = ?', [fileUrl, session.uid], (err) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.json({ success: true, profile_pic: fileUrl });
        });
    });
});

// Agora Token Endpoint
app.get('/api/agora/token', (req, res) => {
    const { channelName, uid, role } = req.query;

    if (!channelName) {
        return res.status(400).json({ error: 'channelName is required' });
    }

    const rtcRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // Use 0 for uid if not provided (Agoras default for letting them assign or using simple int uids)
    // However, string UIDs require buildTokenWithAccount
    const token = RtcTokenBuilder.buildTokenWithAccount(
        AGORA_APP_ID,
        AGORA_APP_CERTIFICATE,
        channelName,
        uid || '0',
        rtcRole,
        privilegeExpiredTs
    );

    res.json({ token, appId: AGORA_APP_ID });
});

// Register
app.post('/api/auth/register', async (req, res) => {
    const { username, password, name } = req.body;
    if (!username || !password || !name) return res.status(400).json({ success: false, error: 'Missing fields' });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const uid = generateId();

        db.run('INSERT INTO users (uid, name, username, password_hash) VALUES (?, ?, ?, ?)',
            [uid, name, username, hashedPassword],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(409).json({ success: false, error: 'Username already exists' });
                    }
                    return res.status(500).json({ success: false, error: err.message });
                }
                res.json({ success: true, message: 'User registered' });
            }
        );
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// Login
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(401).json({ success: false, error: 'Invalid credentials' });

        const sessionId = generateId();
        // Store session (optional but good for validation)
        db.run('INSERT INTO sessions (session_id, uid) VALUES (?, ?)', [sessionId, user.uid], (err) => {
            // Ignore error if sessions table assumes simple logic or non-strict
        });

        res.json({
            success: true,
            sessionId,
            user: { uid: user.uid, name: user.name, username: user.username, profile_pic: user.profile_pic }
        });
    });
});

// Search Users
app.get('/api/users/search/:username', (req, res) => {
    const { username } = req.params;
    db.get('SELECT uid, name, username, profile_pic FROM users WHERE username = ?', [username], (err, row) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        if (!row) return res.status(404).json({ success: false, error: 'User not found' });
        res.json({ success: true, user: row });
    });
});

// Get Conversations (Logic: find unique users you've exchanged messages with)
app.get('/api/conversations', (req, res) => {
    const sessionId = req.headers['x-session-id'];
    if (!sessionId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    // Validate session first (simplified for reconstruction speed)
    // Ideally check sessions table. Assuming trusted for now or quick check:
    // ... verification logic ...

    // For now, we need the UID associated with the session.
    // Since we don't have middleware fully built out, let's query the session.
    db.get('SELECT uid FROM sessions WHERE session_id = ?', [sessionId], (err, session) => {
        if (!session) {
            // Fallback for dev/test without strict session check if implicit
            // But valid flow needs UID.
            return res.status(401).json({ success: false, error: 'Invalid session' });
        }

        const myUid = session.uid;

        const query = `
            SELECT 
                u.uid, u.name, u.username, u.profile_pic,
                m.text as last_message,
                m.timestamp as last_message_time,
                (SELECT COUNT(*) FROM messages 
                 WHERE chat_id = CASE WHEN ? < u.uid THEN ? || '-' || u.uid ELSE u.uid || '-' || ? END
                 AND sender_uid = u.uid AND (read_at IS NULL)) as unread_count
            FROM users u
            JOIN messages m ON m.id = (
                SELECT id FROM messages 
                WHERE chat_id = CASE WHEN ? < u.uid THEN ? || '-' || u.uid ELSE u.uid || '-' || ? END
                ORDER BY timestamp DESC LIMIT 1
            )
            WHERE u.uid != ?
            ORDER BY m.timestamp DESC
        `;

        db.all(query, [myUid, myUid, myUid, myUid, myUid, myUid, myUid], (err, rows) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.json({ success: true, conversations: rows });
        });
    });
});

// Socket.IO
io.use((socket, next) => {
    const { sessionId, uid } = socket.handshake.auth;
    if (sessionId && uid) {
        socket.uid = String(uid); // Force string
        socket.sessionId = sessionId;

        // CRITICAL: Join personal room IMMEDIATELY so broadcasts aren't missed
        const userRoom = `user_room_${socket.uid}`;
        socket.join(userRoom);
        console.log(`🛡️ Middleware: Socket ${socket.id} joined ${userRoom}`);

        return next();
    }
    next(new Error("Unauthorized"));
});

const onlineUsers = new Map(); // uid -> socketId


io.on('connection', (socket) => {
    const uid = String(socket.uid);
    console.log(`🔌 User connected: ${uid}`);
    onlineUsers.set(uid, socket.id);

    socket.on('joinChat', ({ targetUid }) => {
        const chatId = [socket.uid, targetUid].sort().join('-');
        socket.join(chatId);

        // Fetch conversation settings (theme)
        db.get('SELECT theme FROM conversations WHERE chat_id = ?', [chatId], (err, conv) => {
            const currentTheme = (conv && conv.theme) ? conv.theme : 'default';

            // Load history with sender profile pics
            const historyQuery = `
                SELECT m.*, u.profile_pic as sender_profile_pic, u.name as sender_name 
                FROM messages m 
                LEFT JOIN users u ON m.sender_uid = u.uid 
                WHERE m.chat_id = ? 
                ORDER BY m.timestamp ASC
            `;

            db.all(historyQuery, [chatId], (err, rows) => {
                if (rows) {
                    // Fetch target user info (for header)
                    db.get('SELECT profile_pic FROM users WHERE uid = ?', [targetUid], (err, targetUser) => {
                        socket.emit('chatJoined', {
                            chatId,
                            messages: rows,
                            theme: currentTheme,
                            targetProfilePic: targetUser ? targetUser.profile_pic : null
                        });

                        // Mark incoming messages as read
                        const unreadIds = rows
                            .filter(m => m.sender_uid === targetUid && !m.read_at)
                            .map(m => m.id);

                        if (unreadIds.length > 0) {
                            const now = new Date().toISOString();
                            db.run(`UPDATE messages SET status = 'read', read_at = ? WHERE id IN (${unreadIds.join(',')})`, [now]);

                            // Notify sender
                            const targetSocketId = onlineUsers.get(targetUid);
                            if (targetSocketId) {
                                io.to(targetSocketId).emit('messagesRead', { messageIds: unreadIds, readerUid: socket.uid });
                            }
                        }
                    });
                }
            });
        });
    });

    socket.on('changeTheme', ({ targetUid, theme }) => {
        const chatId = [socket.uid, targetUid].sort().join('-');
        const timestamp = new Date().toISOString();

        // Update conversation theme
        db.run('INSERT INTO conversations (chat_id, theme, last_updated) VALUES (?, ?, ?) ON CONFLICT(chat_id) DO UPDATE SET theme = ?, last_updated = ?',
            [chatId, theme, timestamp, theme, timestamp]);

        // Fetch sender name for logging
        db.get('SELECT name FROM users WHERE uid = ?', [socket.uid], (err, user) => {
            const senderName = user ? user.name : 'User';
            const logText = `${senderName} changed the theme to ${theme === 'romantic' ? '❤️ Romantic' : theme.charAt(0).toUpperCase() + theme.slice(1)}`;

            // Save system message
            db.run('INSERT INTO messages (chat_id, sender_uid, text, type, timestamp, status) VALUES (?, ?, ?, ?, ?, ?)',
                [chatId, 'system', logText, 'system', timestamp, 'read'], function (err) {
                    const messageId = this.lastID;
                    const messageData = {
                        id: messageId,
                        chat_id: chatId,
                        sender_uid: 'system',
                        text: logText,
                        type: 'system',
                        timestamp,
                        status: 'read'
                    };

                    // Broadcast to current user and target
                    socket.emit('themeUpdated', { theme, message: messageData });
                    const targetSocketId = onlineUsers.get(targetUid);
                    if (targetSocketId) {
                        io.to(targetSocketId).emit('themeUpdated', { theme, message: messageData });
                    }
                });
        });
    });

    socket.on('sendMessage', ({ targetUid, text, type }) => {
        const chatId = [socket.uid, targetUid].sort().join('-');
        const timestamp = new Date().toISOString();
        const targetSocketId = onlineUsers.get(targetUid);

        let status = 'sent';
        if (targetSocketId) status = 'delivered';

        // Check if this is a System Message (Call Log)
        // If text starts with [System], we might treat it differently or just store it.

        db.run(`INSERT INTO messages (chat_id, sender_uid, text, timestamp, status) VALUES (?, ?, ?, ?, ?)`,
            [chatId, socket.uid, text, timestamp, status],
            function (err) {
                if (err) return console.error(err);

                const lastID = this.lastID;
                db.get('SELECT profile_pic, name FROM users WHERE uid = ?', [socket.uid], (err, sender) => {
                    const messageData = {
                        id: lastID,
                        chat_id: chatId,
                        sender_uid: socket.uid,
                        sender_profile_pic: sender ? sender.profile_pic : null,
                        sender_name: sender ? sender.name : 'Unknown',
                        text,
                        timestamp,
                        status
                    };

                    socket.emit('messageSent', messageData);

                    if (targetSocketId) {
                        io.to(targetSocketId).emit('receiveMessage', messageData);
                        socket.emit('messagesDelivered', { messageIds: [lastID], recipientUid: targetUid });
                    }
                });
            }
        );
    });

    socket.on('endCall', ({ targetUid }) => {
        const targetSocketId = onlineUsers.get(targetUid);
        if (targetSocketId) {
            io.to(targetSocketId).emit('callEnded');
        }
    });

    // Reactions
    socket.on('addReaction', ({ messageId, emoji, targetUid }) => {
        db.get('SELECT * FROM reactions WHERE message_id = ? AND user_uid = ? AND emoji = ?',
            [messageId, socket.uid, emoji], (err, existing) => {
                if (existing) {
                    db.run('DELETE FROM reactions WHERE message_id = ? AND user_uid = ? AND emoji = ?',
                        [messageId, socket.uid, emoji], () => {
                            const data = { messageId, emoji, userUid: socket.uid, action: 'remove' };
                            socket.emit('reactionUpdated', data);
                            const targetSocketId = onlineUsers.get(targetUid);
                            if (targetSocketId) io.to(targetSocketId).emit('reactionUpdated', data);
                        });
                } else {
                    db.run('INSERT INTO reactions (message_id, user_uid, emoji) VALUES (?, ?, ?)',
                        [messageId, socket.uid, emoji], function () {
                            const data = { messageId, emoji, userUid: socket.uid, action: 'add' };
                            socket.emit('reactionUpdated', data);
                            const targetSocketId = onlineUsers.get(targetUid);
                            if (targetSocketId) io.to(targetSocketId).emit('reactionUpdated', data);
                        });
                }
            });
    });

    socket.on('getReactions', ({ messageIds }, callback) => {
        if (!messageIds || messageIds.length === 0) return callback([]);
        const placeholders = messageIds.map(() => '?').join(',');
        db.all(`SELECT * FROM reactions WHERE message_id IN (${placeholders})`,
            messageIds, (err, rows) => callback(rows || []));
    });

    // Typing Indicators
    socket.on('typing', ({ targetUid }) => {
        const targetSocketId = onlineUsers.get(targetUid);
        if (targetSocketId) {
            io.to(targetSocketId).emit('userTyping', { uid: socket.uid });
        }
    });

    socket.on('stopTyping', ({ targetUid }) => {
        const targetSocketId = onlineUsers.get(targetUid);
        if (targetSocketId) {
            io.to(targetSocketId).emit('userStoppedTyping', { uid: socket.uid });
        }
    });



    socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${socket.uid}`);
        onlineUsers.delete(socket.uid);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
