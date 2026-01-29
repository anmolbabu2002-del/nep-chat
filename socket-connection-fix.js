// Fix socket connection issues
// Run this when socket.connected is false

console.log('🔌 SOCKET CONNECTION FIX');
console.log('========================');

// Step 1: Check prerequisites
console.log('Step 1 - Prerequisites:');
console.log('- On chat page:', window.location.href.includes('chat'));
console.log('- Has session:', !!localStorage.getItem('user_sessionId'));
console.log('- Has user ID:', !!localStorage.getItem('user_uid'));

// Step 2: Check current socket state
console.log('Step 2 - Current socket state:');
console.log('- Socket object exists:', !!window.socket);
if (window.socket) {
    console.log('- Socket connected:', window.socket.connected);
    console.log('- Socket ID:', window.socket.id || 'none');
    console.log('- Connection state:', window.socket.io?.readyState);
} else {
    console.log('- No socket object found');
}

// Step 3: Check Socket.IO library
console.log('Step 3 - Socket.IO library:');
console.log('- io object available:', typeof io !== 'undefined');
if (typeof io !== 'undefined') {
    console.log('- io version:', io.version);
} else {
    console.log('- Socket.IO script loaded:', !!document.querySelector('script[src*="socket.io"]'));
}

// Step 4: Force socket creation
console.log('Step 4 - Creating socket connection:');

function createSocketConnection() {
    const sessionId = localStorage.getItem('user_sessionId');
    const userId = localStorage.getItem('user_uid');

    if (!sessionId || !userId) {
        console.log('❌ Missing credentials - log in first');
        return false;
    }

    if (typeof io === 'undefined') {
        console.log('❌ Socket.IO library not loaded');
        return false;
    }

    console.log('🔌 Creating new socket connection...');

    // Disconnect existing socket if any
    if (window.socket) {
        window.socket.disconnect();
    }

    // Create new socket
    window.socket = io('http://localhost:3000', {
        auth: {
            sessionId: sessionId,
            uid: userId
        },
        transports: ['polling', 'websocket'], // Try both
        timeout: 10000,
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000
    });

    // Connection events
    window.socket.on('connect', () => {
        console.log('✅ SOCKET CONNECTED SUCCESSFULLY!');
        console.log('- Socket ID:', window.socket.id);
        console.log('- Transport:', window.socket.io?.engine?.transport?.name);
        console.log('🎉 Live chatting is now active!');
    });

    window.socket.on('connect_error', (error) => {
        console.log('❌ Socket connection failed:', error.message);
        console.log('🔧 Troubleshooting:');
        console.log('- Check if server is running: node server.js');
        console.log('- Check network connection');
        console.log('- Try refreshing the page');
    });

    window.socket.on('disconnect', (reason) => {
        console.log('🔌 Socket disconnected:', reason);
    });

    // Message events
    window.socket.on('messageSent', (msg) => {
        console.log('📤 Message sent:', msg.id);
    });

    window.socket.on('receiveMessage', (msg) => {
        console.log('📨 Message received:', msg.id);
    });

    return true;
}

// Try to create connection
const created = createSocketConnection();

if (created) {
    console.log('⏳ Attempting connection... (wait 5 seconds)');

    setTimeout(() => {
        console.log('📊 Connection status after 5 seconds:');
        if (window.socket) {
            console.log('- Connected:', window.socket.connected);
            console.log('- Socket ID:', window.socket.id || 'none');
            console.log('- Ready state:', window.socket.io?.readyState);

            if (window.socket.connected) {
                console.log('✅ SUCCESS! Socket is now connected');
                console.log('🧪 Test live chatting: sendMessage()');
            } else {
                console.log('❌ Still not connected');
                console.log('Check server logs and network');
            }
        } else {
            console.log('❌ Socket object was not created');
        }
    }, 5000);
} else {
    console.log('❌ Could not create socket - check prerequisites above');
}

// Test function
window.sendMessage = function() {
    if (!window.socket || !window.socket.connected) {
        console.log('❌ Socket not connected - run connection fix first');
        return;
    }

    console.log('📤 Sending test message...');
    window.socket.emit('sendMessage', {
        targetUid: 'test_recipient',
        text: 'Live chat test - ' + new Date().toLocaleTimeString()
    });
};
