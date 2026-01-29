// Test online/offline delivery timing
// Run this in browser console

console.log('🔌 TESTING ONLINE DELIVERY TIMING');
console.log('===================================');

// Check socket connection
console.log('🔌 Socket Status:', window.socket ? window.socket.connected : 'NO SOCKET');
console.log('👤 Current User:', window.currentUser ? window.currentUser.name : 'NOT LOGGED IN');

// Check for any pending delivery events
let deliveryCount = 0;
let readCount = 0;

if (window.socket) {
    // Listen for delivery events
    window.socket.on('messagesDelivered', (data) => {
        deliveryCount++;
        console.log('📨 DELIVERY EVENT:', data);
        console.log(`  Recipient: ${data.recipientUid}`);
        console.log(`  Messages: ${data.messageIds.length}`);
    });

    // Listen for read events
    window.socket.on('messagesRead', (data) => {
        readCount++;
        console.log('👁️ READ EVENT:', data);
        console.log(`  Reader: ${data.readerUid}`);
        console.log(`  Messages: ${data.messageIds.length}`);
    });

    console.log('✅ Listening for delivery and read events...');
} else {
    console.log('❌ No socket connection');
}

// Check current message statuses
const allMessages = document.querySelectorAll('.message');
console.log(`💬 Total messages in chat: ${allMessages.length}`);

const statusSummary = {
    sent: 0,
    delivered: 0,
    read: 0
};

allMessages.forEach(msg => {
    const status = msg.querySelector('.message-status');
    if (status) {
        if (status.classList.contains('read')) statusSummary.read++;
        else if (status.classList.contains('delivered')) statusSummary.delivered++;
        else if (status.classList.contains('sent')) statusSummary.sent++;
    }
});

console.log('📊 Status Summary:', statusSummary);

console.log('\n🎯 TEST INSTRUCTIONS:');
console.log('1. Send a message (should be SENT)');
console.log('2. Have recipient log in (should become DELIVERED)');
console.log('3. Recipient opens chat and views message (should become READ)');
console.log('4. Watch the events above appear in real-time!');
