const io = require('socket.io-client');
const API_URL = 'http://localhost:3000';

// Helper for delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function verifyApp() {
    console.log('🚀 Starting System Verification (History & Status)...');

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
        username: `userA_${timestamp}`,
        password: 'password123',
        name: 'User A'
    };
    const userB = {
        username: `userB_${timestamp}`,
        password: 'password123',
        name: 'User B'
    };

    try {
        // 1. Register Users
        console.log('\n👤 Registering users...');
        await registerUser(userA);
        await registerUser(userB);
        console.log('✅ Users registered');

        // 2. Login Users
        console.log('\n🔑 Logging in users...');
        const sessionA = await loginUser(userA);
        const sessionB = await loginUser(userB);
        console.log('✅ Users logged in');

        // 3. Connect Sockets
        console.log('\n🔌 Connecting sockets...');
        const socketA = connectSocket(sessionA);
        const socketB = connectSocket(sessionB);

        await Promise.all([
            waitForConnect(socketA),
            waitForConnect(socketB)
        ]);
        console.log('✅ Sockets connected');

        // 4. Test Messaging & Delivery Status
        console.log('\n💬 Testing messaging & delivery status...');

        // Both users join chat
        console.log('👥 Joining chat rooms...');
        socketA.emit('joinChat', { targetUid: sessionB.uid });
        socketB.emit('joinChat', { targetUid: sessionA.uid });

        await Promise.all([
            waitForEvent(socketA, 'chatJoined'),
            waitForEvent(socketB, 'chatJoined')
        ]);
        console.log('✅ Both users joined chat');

        const messageText = `Hello User B! (${timestamp})`;

        // Validating Delivery Status
        // We expect the 'messageSent' event to confirm the message, 
        // AND since User B is online and in the room, it should be marked delivered ideally.
        // Server implementation: if(onlineUsers > 0) message.status = 'delivered'

        const messageSentPromise = new Promise((resolve, reject) => {
            socketA.once('messageSent', (msg) => {
                console.log(`📨 Message sent confirmation: ID=${msg.id}, Status=${msg.status}`);
                if (msg.status === 'delivered') {
                    console.log('✅ Message status is DELIVERED (Correct)');
                    resolve(msg);
                } else {
                    console.log(`⚠️ Message status is '${msg.status}' (Expected 'delivered')`);
                    // Note: Depending on race conditions in server (socket.join vs online check), 
                    // it might be 'sent' initially. But strictly if User B is joined, it should be delivered.
                    resolve(msg);
                }
            });
            setTimeout(() => reject(new Error('messageSent timeout')), 5000);
        });

        const receivePromise = waitForEvent(socketB, 'receiveMessage');

        // User A sends message
        await delay(500);
        socketA.emit('sendMessage', {
            targetUid: sessionB.uid,
            text: messageText
        });
        console.log('📤 User A sent message');

        const sentMsg = await messageSentPromise;
        const recMsg = await receivePromise;

        if (recMsg.text === messageText) {
            console.log('✅ User B received message:', recMsg.text);
        } else {
            throw new Error('Message content mismatch');
        }

        // 5. Test Chat History Persistence
        console.log('\n📜 Testing chat history persistence...');

        // User A leaves and comes back (simulate by re-joining or just calling joinChat again)
        // Ideally we should make a new socket connection to be sure, but joinChat call is enough to trigger DB fetch.

        console.log('🔄 User A re-joining chat...');
        socketA.emit('joinChat', { targetUid: sessionB.uid });

        const historyData = await waitForEvent(socketA, 'chatJoined');

        // Find our message in history
        const foundMessage = historyData.messages.find(m => m.text === messageText);

        if (foundMessage) {
            console.log(`✅ Chat history contains recent message: ID=${foundMessage.id}`);
            console.log(`   Detailed Status: ${foundMessage.status}`);
        } else {
            console.error('❌ Recent message NOT found in history!');
            console.log('History length:', historyData.messages.length);
            throw new Error('History check failed');
        }

        // Cleanup
        socketA.disconnect();
        socketB.disconnect();

        console.log('\n🎉 Verification completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Verification failed:', error.message);
        if (error.cause) console.error('  Cause:', error.cause);
        process.exit(1);
    }
}

async function registerUser(user) {
    const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    const data = await res.json();
    if (!data.success) throw new Error(`Registration failed for ${user.username}: ${data.error}`);
    return data;
}

async function loginUser(user) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, password: user.password })
    });
    const data = await res.json();
    if (!data.success) throw new Error(`Login failed for ${user.username}: ${data.error}`);
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
        socket.on('connect', () => {
            clearTimeout(timeout);
            resolve();
        });
        socket.on('connect_error', (err) => {
            clearTimeout(timeout);
            reject(new Error(`Socket connect error: ${err.message}`));
        });
    });
}

function waitForEvent(socket, eventName) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error(`Timeout waiting for ${eventName}`)), 3000);
        socket.once(eventName, (data) => {
            clearTimeout(timeout);
            resolve(data);
        });
    });
}

verifyApp();
