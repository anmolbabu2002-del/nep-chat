// FIXED: WhatsApp delivery test (no return statements)
// Run this entire block in browser console

console.log('🎯 TESTING WHATSAPP DELIVERY EVENTS');
console.log('====================================');

// Check setup
if (!window.socket) {
    console.log('❌ ERROR: No socket connection - make sure you\'re logged in');
    console.log('🔗 Go to http://localhost:3000 and log in first');
    console.log('⏹️ Test stopped - please log in first');
} else if (!window.currentUser) {
    console.log('❌ ERROR: Not logged in - please log in first');
    console.log('⏹️ Test stopped - please log in first');
} else {
    console.log('✅ Socket connected:', window.socket.connected);
    console.log('👤 Logged in as:', window.currentUser.name);

    // Clear any existing listeners
    if (window.testDeliveryListener) {
        window.socket.off('messagesDelivered', window.testDeliveryListener);
    }
    if (window.testReadListener) {
        window.socket.off('messagesRead', window.testReadListener);
    }

    // Set up event listeners
    window.testDeliveryListener = (data) => {
        console.log(`\n📨 MESSAGE DELIVERED!`);
        console.log(`   Recipient: ${data.recipientUid}`);
        console.log(`   Messages: ${data.messageIds ? data.messageIds.length : 'unknown'}`);
        console.log(`   Time: ${new Date().toLocaleTimeString()}`);

        // Update UI
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
    };

    window.testReadListener = (data) => {
        console.log(`\n👁️ MESSAGE READ!`);
        console.log(`   Reader: ${data.readerUid}`);
        console.log(`   Messages: ${data.messageIds ? data.messageIds.length : 'unknown'}`);
        console.log(`   Time: ${new Date().toLocaleTimeString()}`);

        // Update UI
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
    };

    window.socket.on('messagesDelivered', window.testDeliveryListener);
    window.socket.on('messagesRead', window.testReadListener);

    console.log('\n🎯 EVENT LISTENERS ACTIVE!');
    console.log('Now test the flow:');
    console.log('');
    console.log('1. 📤 Send a message → Shows ○ (sent)');
    console.log('2. 🔄 Recipient logs in → Shows ○○ (delivered) + console message');
    console.log('3. 👁️ Recipient views → Shows gold ○○ (read) + console message');
    console.log('');
    console.log('Watch the console for real-time updates! 🚀');
}
