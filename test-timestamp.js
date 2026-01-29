const io = require('socket.io-client');
const API_URL = 'http://localhost:3000';

// Helper for delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function verifyTimestamp() {
    console.log('🚀 Starting Timestamp Verification...');

    // Check if server is up
    try {
        await fetch(API_URL);
        console.log('✅ Server is reachable');
    } catch (e) {
        console.error('❌ Server is NOT reachable. Make sure it is running.');
        process.exit(1);
    }

    const timestamp = Date.now();
    const userA = {
        username: `time_user_${timestamp}`,
        password: 'password123',
        name: 'Time Tester'
    };

    // Recipient (can use same user for self-message or create new)
    // Self-message is easiest for quick test if allowed, but let's stick to standard flow
    const userB = {
        username: `time_userB_${timestamp}`,
        password: 'password123',
        name: 'Time Tester B'
    };

    try {
        // Register & Login
        await registerUser(userA);
        await registerUser(userB);
        const sessionA = await loginUser(userA);
        const sessionB = await loginUser(userB);

        const socketA = connectSocket(sessionA);
        await waitForConnect(socketA);
        console.log('✅ Socket connected');

        // Join chat
        socketA.emit('joinChat', { targetUid: sessionB.uid });
        await waitForEvent(socketA, 'chatJoined');

        // Send message
        const messageText = `Time Check ${timestamp}`;

        // Listen for confirmation (Live Event)
        const sentPromise = new Promise((resolve) => {
            socketA.once('messageSent', (msg) => resolve(msg));
        });

        socketA.emit('sendMessage', {
            targetUid: sessionB.uid,
            text: messageText
        });

        const liveMessage = await sentPromise;
        console.log(`✅ Live Message Timestamp: ${liveMessage.timestamp}`);

        if (!liveMessage.timestamp.endsWith('Z')) {
            throw new Error(`Live timestamp is NOT ISO 8601 UTC (missing Z): ${liveMessage.timestamp}`);
        }

        // Wait a small bit to ensure DB write is fully done (though emit usually happens after DB callback)
        await delay(500);

        // Fetch History (Stored Event)
        // Re-join to get history
        const historyPromise = new Promise((resolve) => {
            socketA.emit('joinChat', { targetUid: sessionB.uid });
            socketA.once('chatJoined', (data) => resolve(data));
        });

        const historyData = await historyPromise;
        const storedMessage = historyData.messages.find(m => m.id === liveMessage.id);

        if (!storedMessage) {
            throw new Error('Message not found in history');
        }

        console.log(`✅ Stored Message Timestamp: ${storedMessage.timestamp}`);

        if (storedMessage.timestamp !== liveMessage.timestamp) {
            console.error('❌ Timestamp Mismatch!');
            console.error(`Live:   ${liveMessage.timestamp}`);
            console.error(`Stored: ${storedMessage.timestamp}`);
            throw new Error('Timestamp mismatch between live and stored message');
        }

        console.log('✅ Timestamps match strictly!');

        socketA.disconnect();
        console.log('\n🎉 Timestamp verification passed!');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Verification failed:', error.message);
        process.exit(1);
    }
}

async function registerUser(user) {
    const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    return res.json();
}

async function loginUser(user) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, password: user.password })
    });
    const data = await res.json();
    return { ...data.user, sessionId: data.sessionId };
}

function connectSocket(userSession) {
    return io(API_URL, {
        auth: {
            sessionId: userSession.sessionId,
            uid: userSession.uid
        },
        transports: ['polling', 'websocket'],
        reconnection: false
    });
}

function waitForConnect(socket) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Socket connection timeout')), 3000);
        socket.on('connect', () => { clearTimeout(timeout); resolve(); });
        socket.on('connect_error', (err) => { clearTimeout(timeout); reject(err); });
    });
}

function waitForEvent(socket, eventName) {
    return new Promise((resolve) => {
        socket.once(eventName, (data) => resolve(data));
    });
}

verifyTimestamp();
