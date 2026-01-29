// Complete connection and login troubleshooting
// Run this step by step in browser console

console.log('🔧 COMPLETE CONNECTION TROUBLESHOOTING');
console.log('======================================');

// Step 1: Check current page
console.log('📄 STEP 1 - Current Page Check:');
console.log('- URL:', window.location.href);
console.log('- Is chat page:', window.location.href.includes('chat'));
console.log('- Is login page:', window.location.href.includes('login'));

if (!window.location.href.includes('chat')) {
    console.log('❌ PROBLEM: You are not on the chat page!');
    console.log('🔧 SOLUTION: Go to http://localhost:3000 and log in first');
    console.log('   1. Open http://localhost:3000');
    console.log('   2. Enter username/password');
    console.log('   3. Click login');
    console.log('   4. Click on a conversation');
    console.log('   5. Then run this script again');
    return;
}

// Step 2: Check stored credentials
console.log('\n🔐 STEP 2 - Stored Credentials:');
const sessionId = localStorage.getItem('user_sessionId');
const userName = localStorage.getItem('user_name');
const userId = localStorage.getItem('user_uid');

console.log('- Session ID:', sessionId ? 'YES (' + sessionId.substring(0, 10) + '...)' : 'NO');
console.log('- User Name:', userName || 'NO');
console.log('- User ID:', userId || 'NO');

if (!sessionId || !userName || !userId) {
    console.log('❌ PROBLEM: Missing login credentials!');
    console.log('🔧 SOLUTION: Clear browser data and log in again');
    console.log('   1. Press Ctrl+Shift+Delete (clear browsing data)');
    console.log('   2. Select "Cookies and site data"');
    console.log('   3. Click Clear');
    console.log('   4. Go to http://localhost:3000');
    console.log('   5. Log in again');
    return;
}

// Step 3: Check JavaScript variables
console.log('\n📊 STEP 3 - JavaScript Variables:');
console.log('- window.currentUser:', !!window.currentUser);
console.log('- window.socket:', !!window.socket);

if (window.currentUser) {
    console.log('  Current user details:', window.currentUser);
} else {
    console.log('❌ PROBLEM: currentUser not set!');
}

if (window.socket) {
    console.log('  Socket exists, connected:', window.socket.connected);
} else {
    console.log('❌ PROBLEM: Socket not created!');
}

// Step 4: Manual socket creation (if needed)
console.log('\n🔌 STEP 4 - Manual Socket Connection:');

function createManualSocket() {
    console.log('Creating manual socket connection...');

    if (typeof io === 'undefined') {
        console.log('❌ Socket.IO library not loaded!');
        return false;
    }

    window.socket = io('http://localhost:3000', {
        auth: {
            sessionId: sessionId,
            uid: userId
        },
        transports: ['polling'],
        timeout: 20000,
        forceNew: false,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    });

    return new Promise((resolve) => {
        window.socket.on('connect', () => {
            console.log('✅ Manual socket connected!');
            console.log('- Socket ID:', window.socket.id);

            // Set up basic event handlers
            setupBasicHandlers();
            resolve(true);
        });

        window.socket.on('connect_error', (error) => {
            console.log('❌ Manual socket failed:', error.message);
            resolve(false);
        });

        // Timeout
        setTimeout(() => {
            if (!window.socket || !window.socket.connected) {
                console.log('⏰ Manual socket timeout');
                resolve(false);
            }
        }, 10000);
    });
}

function setupBasicHandlers() {
    if (!window.socket) return;

    window.socket.on('messageSent', (msg) => {
        console.log('📤 Message sent confirmation:', msg.id);
    });

    window.socket.on('receiveMessage', (msg) => {
        console.log('📨 Message received:', msg.id, msg.text?.substring(0, 30));
    });

    window.socket.on('messagesDelivered', (data) => {
        console.log('📬 Messages delivered to:', data.recipientUid);
    });

    window.socket.on('messagesRead', (data) => {
        console.log('👁️ Messages read by:', data.readerUid);
    });
}

// Step 5: Try to connect
console.log('\n🚀 STEP 5 - Connection Attempt:');

if (!window.socket) {
    createManualSocket().then((connected) => {
        if (connected) {
            console.log('\n🎉 SUCCESS! Socket connected manually');
            console.log('\n🧪 READY FOR TESTING!');
            console.log('Try sending a message now');
            console.log('Run: testMessageSpeed()');
        } else {
            console.log('\n❌ FAILED: Could not establish connection');
            console.log('Check:');
            console.log('- Server running on port 3000');
            console.log('- Network connectivity');
            console.log('- Browser console for errors');
        }
    });
} else if (window.socket.connected) {
    console.log('✅ Socket already connected!');
    console.log('\n🧪 READY FOR TESTING!');
    console.log('Try sending a message now');
    console.log('Run: testMessageSpeed()');
} else {
    console.log('❌ Socket exists but not connected - trying to reconnect...');
    window.socket.connect();
}

// Helper function for testing
window.testMessageSpeed = function() {
    if (!window.socket || !window.socket.connected) {
        console.log('❌ Not connected - run the troubleshooting script first');
        return;
    }

    console.log('⚡ Testing message speed...');
    const start = Date.now();

    window.socket.emit('sendMessage', {
        targetUid: 'speed_test_' + Date.now(),
        text: 'Speed test message - ' + new Date().toISOString()
    });

    window.socket.once('messageSent', (msg) => {
        const time = Date.now() - start;
        console.log(`📤 Message sent in ${time}ms`);
        console.log(`⚡ Speed: ${time < 200 ? 'EXCELLENT' : time < 1000 ? 'GOOD' : 'SLOW'}`);
    });
};

console.log('\n📋 SUMMARY:');
console.log('- If all steps pass: You are ready to test live chatting!');
console.log('- If any step fails: Follow the solutions above');
console.log('- After fixing: Run testMessageSpeed() to test speed');
