// Test WhatsApp-style delivery events
// Run this in browser console

console.log('🎯 TESTING WHATSAPP DELIVERY EVENTS');
console.log('====================================');

// Check if we're in a chat
if (!window.socket) {
    console.log('❌ No socket connection - make sure you\'re logged in and in a chat');
    console.log('🔗 Go to http://localhost:3000 and log in first');
    return;
}

if (!window.currentUser) {
    console.log('❌ Not logged in - please log in first');
    return;
}

console.log('✅ Socket connected:', window.socket.connected);
console.log('👤 Logged in as:', window.currentUser.name);

// Set up event listeners with immediate feedback
let deliveryEvents = 0;
let readEvents = 0;

console.log('\n📡 Setting up event listeners...');

window.socket.on('messagesDelivered', (data) => {
    deliveryEvents++;
    console.log(`\n📨 MESSAGE DELIVERED! (#${deliveryEvents})`);
    console.log(`   Recipient: ${data.recipientUid}`);
    console.log(`   Messages: ${data.messageIds ? data.messageIds.length : 'unknown'}`);
    console.log(`   Time: ${new Date().toLocaleTimeString()}`);

    // Update UI immediately
    if (data.messageIds) {
        data.messageIds.forEach(id => {
            const msgElement = document.querySelector(`[data-message-id="${id}"]`);
            if (msgElement) {
                const statusElement = msgElement.querySelector('.message-status');
                if (statusElement) {
                    statusElement.outerHTML = '<span class="message-status delivered" title="Delivered ○○"><i class="fas fa-circle"></i><i class="fas fa-circle"></i></span>';
                    console.log(`   ✅ Updated message ${id} to delivered`);
                }
            }
        });
    }
});

window.socket.on('messagesRead', (data) => {
    readEvents++;
    console.log(`\n👁️ MESSAGE READ! (#${readEvents})`);
    console.log(`   Reader: ${data.readerUid}`);
    console.log(`   Messages: ${data.messageIds ? data.messageIds.length : 'unknown'}`);
    console.log(`   Time: ${new Date().toLocaleTimeString()}`);

    // Update UI immediately
    if (data.messageIds) {
        data.messageIds.forEach(id => {
            const msgElement = document.querySelector(`[data-message-id="${id}"]`);
            if (msgElement) {
                const statusElement = msgElement.querySelector('.message-status');
                if (statusElement) {
                    statusElement.outerHTML = '<span class="message-status read" title="Read ○○"><i class="fas fa-circle"></i><i class="fas fa-circle"></i></span>';
                    console.log(`   ✅ Updated message ${id} to read`);
                }
            }
        });
    }
});

console.log('\n🎯 EVENT LISTENERS ACTIVE!');
console.log('Now perform these actions to test:');
console.log('');
console.log('1. 📤 Send a message from this window');
console.log('   → Should show ○ (sent)');
console.log('');
console.log('2. 🔄 Switch to another browser/incognito window');
console.log('   → Log in as a different user');
console.log('   → The message should change to ○○ (delivered)');
console.log('');
console.log('3. 👁️ In the other window, view the message');
console.log('   → Should change to gold ○○ (read)');
console.log('');
console.log('Watch the console here for real-time events!');

console.log('\n📊 Current stats:');
console.log(`   Delivery events: ${deliveryEvents}`);
console.log(`   Read events: ${readEvents}`);

// Return a success message instead of undefined
return '🎯 Event listeners set up successfully! Watch for delivery and read notifications.';
