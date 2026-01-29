// Alternative Socket.IO connection methods
// Try these different approaches if the main one doesn't work

console.log('🔌 ALTERNATIVE SOCKET CONNECTION METHODS');
console.log('=======================================');

// Method 1: Simple connection (no auth)
console.log('Method 1: Simple connection (no authentication)');
function connectSimple() {
    console.log('🔌 Trying simple connection...');

    if (window.socket) {
        window.socket.disconnect();
    }

    window.socket = io('http://localhost:3000', {
        transports: ['polling'],
        timeout: 5000,
        forceNew: true
    });

    window.socket.on('connect', () => {
        console.log('✅ Simple connection successful!');
        console.log('Socket ID:', window.socket.id);
    });

    window.socket.on('connect_error', (error) => {
        console.log('❌ Simple connection failed:', error.message);
    });
}

// Method 2: WebSocket only (faster)
console.log('Method 2: WebSocket transport only');
function connectWebSocket() {
    console.log('🔌 Trying WebSocket-only connection...');

    if (window.socket) {
        window.socket.disconnect();
    }

    window.socket = io('http://localhost:3000', {
        transports: ['websocket'],
        timeout: 5000,
        forceNew: true
    });

    window.socket.on('connect', () => {
        console.log('✅ WebSocket connection successful!');
        console.log('Socket ID:', window.socket.id);
    });

    window.socket.on('connect_error', (error) => {
        console.log('❌ WebSocket connection failed:', error.message);
        console.log('💡 WebSocket may not be supported, try polling instead');
    });
}

// Method 3: Manual authentication after connection
console.log('Method 3: Connect first, authenticate later');
function connectThenAuth() {
    console.log('🔌 Connecting first, authenticating after...');

    if (window.socket) {
        window.socket.disconnect();
    }

    window.socket = io('http://localhost:3000', {
        transports: ['polling'],
        timeout: 5000,
        forceNew: true,
        autoConnect: false  // Don't connect immediately
    });

    // Manual connect
    window.socket.connect();

    window.socket.on('connect', () => {
        console.log('✅ Connected! Now authenticating...');

        // Send authentication
        const sessionId = localStorage.getItem('user_sessionId');
        const userId = localStorage.getItem('user_uid');

        if (sessionId && userId) {
            window.socket.emit('authenticate', {
                sessionId: sessionId,
                uid: userId
            });
        } else {
            console.log('❌ No credentials to authenticate with');
        }
    });

    window.socket.on('authenticated', (user) => {
        console.log('✅ Authentication successful!');
        console.log('User:', user);
    });

    window.socket.on('auth_error', (error) => {
        console.log('❌ Authentication failed:', error);
    });
}

// Method 4: Debug connection
console.log('Method 4: Debug connection with detailed logging');
function debugConnection() {
    console.log('🔍 Debug connection mode...');

    if (window.socket) {
        window.socket.disconnect();
    }

    window.socket = io('http://localhost:3000', {
        transports: ['polling'],
        timeout: 10000,
        forceNew: true
    });

    // Detailed event logging
    window.socket.on('connect', () => {
        console.log('🔌 CONNECT event fired');
        console.log('   Socket ID:', window.socket.id);
        console.log('   Transport:', window.socket.io?.engine?.transport?.name);
        console.log('   Connected:', window.socket.connected);
    });

    window.socket.on('connect_error', (error) => {
        console.log('❌ CONNECT_ERROR event:', error);
        console.log('   Error message:', error.message);
        console.log('   Error type:', error.type);
        console.log('   Error description:', error.description);
    });

    window.socket.on('connect_timeout', (timeout) => {
        console.log('⏰ CONNECT_TIMEOUT:', timeout);
    });

    window.socket.on('error', (error) => {
        console.log('🚨 GENERAL ERROR:', error);
    });

    window.socket.on('disconnect', (reason) => {
        console.log('🔌 DISCONNECT event:', reason);
    });

    window.socket.on('reconnect', (attempt) => {
        console.log('🔄 RECONNECT event, attempt:', attempt);
    });

    window.socket.on('reconnect_error', (error) => {
        console.log('❌ RECONNECT_ERROR:', error);
    });
}

// Method 5: Server health check
console.log('Method 5: Check if server is reachable');
function checkServer() {
    console.log('🌐 Checking server connectivity...');

    fetch('http://localhost:3000')
        .then(response => {
            console.log('✅ Server reachable');
            console.log('   Status:', response.status);
            console.log('   OK:', response.ok);
            return response.text();
        })
        .then(text => {
            console.log('   Response length:', text.length);
            console.log('✅ Server is responding');
        })
        .catch(error => {
            console.log('❌ Server not reachable:', error.message);
            console.log('💡 Make sure server is running: node server.js');
        });

    // Check Socket.IO endpoint
    fetch('http://localhost:3000/socket.io/?EIO=4&transport=polling')
        .then(response => {
            console.log('✅ Socket.IO endpoint reachable');
            console.log('   Status:', response.status);
        })
        .catch(error => {
            console.log('❌ Socket.IO endpoint not reachable:', error.message);
        });
}

// Available functions
console.log('\n🎯 AVAILABLE METHODS:');
console.log('Run these commands to try different connection methods:');
console.log('');
console.log('checkServer()          - Check if server is running');
console.log('connectSimple()        - Simple connection (no auth)');
console.log('connectWebSocket()     - WebSocket only transport');
console.log('connectThenAuth()      - Connect then authenticate');
console.log('debugConnection()      - Detailed logging connection');
console.log('');
console.log('After connecting, test with:');
console.log('window.socket.emit("test")');

// Make functions global
window.checkServer = checkServer;
window.connectSimple = connectSimple;
window.connectWebSocket = connectWebSocket;
window.connectThenAuth = connectThenAuth;
window.debugConnection = debugConnection;

console.log('✅ Functions loaded! Start with: checkServer()');
