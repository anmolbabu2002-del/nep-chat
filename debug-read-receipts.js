// Debug read receipts - test intersection observer
// Run this in browser console on chat page

console.log('🔍 DEBUGGING READ RECEIPTS');
console.log('===========================');

// 1. Check if observer exists
console.log('👁️ Read Observer Status:');
if (window.readObserver) {
    console.log('  ✅ Observer exists');
} else {
    console.log('  ❌ Observer not created yet - try refreshing or waiting for chat to load');
}

// 2. Check messages that should be observed
console.log('\n💬 Messages Status:');
const allMessages = document.querySelectorAll('.message[data-message-id]');
const sentMessages = document.querySelectorAll('.message.sent[data-message-id]');
const receivedMessages = document.querySelectorAll('.message:not(.sent)[data-message-id]');

console.log(`  Total messages: ${allMessages.length}`);
console.log(`  Sent by me: ${sentMessages.length}`);
console.log(`  Received: ${receivedMessages.length}`);

receivedMessages.forEach((msg, i) => {
    const id = msg.getAttribute('data-message-id');
    const status = msg.querySelector('.message-status');
    const isRead = status && status.classList.contains('read');
    console.log(`    Message ${i+1} (ID: ${id}): Read = ${isRead}`);
});

// 3. Manual trigger test
console.log('\n🧪 MANUAL TRIGGER TEST:');
console.log('Run this in console: manualMarkAsRead()');
console.log('This should mark all received messages as read manually');

// 4. Intersection observer test
console.log('\n🎯 INTERSECTION TEST:');
console.log('Try scrolling to different messages and watch console for:');
console.log('  "👁️ Intersection observer triggered"');
console.log('  "📖 MARKING X MESSAGES AS READ"');

// 5. Socket test
console.log('\n🔌 SOCKET TEST:');
if (window.socket) {
    console.log('  ✅ Socket connected:', window.socket.connected);

    // Test socket emit
    window.socket.emit('test', { message: 'test from debug' });
    console.log('  📤 Test message sent to server');
} else {
    console.log('  ❌ Socket not connected');
}

// 6. Instructions
console.log('\n📋 DEBUGGING STEPS:');
console.log('1. Scroll through received messages');
console.log('2. Check console for intersection events');
console.log('3. If no events, try: manualMarkAsRead()');
console.log('4. Check if status indicators change');
console.log('5. Report what you see in console');
