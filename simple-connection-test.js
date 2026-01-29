// Simple connection test - no complex syntax
// Run this line by line in browser console

console.log('🔧 SIMPLE CONNECTION TEST');
console.log('========================');

// Test 1: Check page
console.log('Step 1 - Page check:');
console.log('URL:', window.location.href);
console.log('Is chat page:', window.location.href.includes('chat'));

// Test 2: Check login data
console.log('Step 2 - Login check:');
const sessionId = localStorage.getItem('user_sessionId');
const userName = localStorage.getItem('user_name');
console.log('Has session:', !!sessionId);
console.log('Has username:', !!userName);

// Test 3: Check variables
console.log('Step 3 - Variables check:');
console.log('currentUser exists:', !!window.currentUser);
console.log('socket exists:', !!window.socket);

// Test 4: Quick socket test
console.log('Step 4 - Socket test:');
if (window.socket) {
    console.log('Socket connected:', window.socket.connected);
} else {
    console.log('No socket found');
}

// Test 5: Simple message test
console.log('Step 5 - Message test:');
window.testMessage = function() {
    console.log('Testing message send...');
    if (!window.socket || !window.socket.connected) {
        console.log('ERROR: Not connected');
        return;
    }

    const startTime = Date.now();
    window.socket.emit('sendMessage', {
        targetUid: 'test',
        text: 'Test message ' + Date.now()
    });

    window.socket.once('messageSent', function() {
        const time = Date.now() - startTime;
        console.log('SUCCESS: Message sent in', time, 'ms');
    });

    setTimeout(function() {
        console.log('TIMEOUT: Message send took too long');
    }, 5000);
};

console.log('DONE! To test messaging, run: testMessage()');
