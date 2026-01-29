// Test message deduplication fix
console.log('🧪 TESTING MESSAGE DEDUPLICATION FIX');

// Check authentication
const sessionId = localStorage.getItem('user_sessionId');
const currentUid = localStorage.getItem('user_uid');

if (!sessionId || !currentUid) {
    console.error('❌ Not logged in');
    return;
}

console.log('✅ Authenticated as:', currentUid);

// Monitor message events
let messageCount = 0;
let sentMessages = 0;
let receivedMessages = 0;

console.log('\n📡 MONITORING MESSAGE EVENTS...');

// Override displayMessage to count calls
const originalDisplayMessage = window.displayMessage;
window.displayMessage = function(message) {
    messageCount++;
    console.log(`📨 Message #${messageCount} displayed: "${message.text}" (from: ${message.senderUid})`);

    // Call original function
    return originalDisplayMessage.apply(this, arguments);
};

// Test socket connection
const socket = io('http://localhost:3000', {
    auth: { sessionId: sessionId, uid: currentUid },
    transports: ['polling']
});

socket.on('connect', () => {
    console.log('✅ Socket connected');
});

socket.on('messageSent', (message) => {
    sentMessages++;
    console.log(`📤 messageSent event #${sentMessages}: ${message.text}`);
});

socket.on('receiveMessage', (message) => {
    receivedMessages++;
    console.log(`📥 receiveMessage event #${receivedMessages}: ${message.text}`);
});

console.log('\n🎯 TEST INSTRUCTIONS:');
console.log('1. Open this chat in your browser');
console.log('2. Send a message using the chat interface');
console.log('3. Check the console output above');
console.log('4. You should see:');
console.log('   - 1 displayMessage call');
console.log('   - 1 messageSent event');
console.log('   - 0 receiveMessage events (since you sent it)');
console.log('');
console.log('5. Have another user open the same chat');
console.log('6. Send another message');
console.log('7. The other user should see:');
console.log('   - 1 displayMessage call');
console.log('   - 1 receiveMessage event');
console.log('   - 0 messageSent events (since they received it)');

console.log('\n⏳ Ready for testing...');
