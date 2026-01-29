// Manual test to force mark messages as read
// Run this in browser console to test read status

console.log('🧪 MANUAL READ STATUS TEST');

function testReadStatus() {
    // Find all delivered messages (dark golden ○○)
    const deliveredMessages = document.querySelectorAll('.message.sent .message-status.delivered');

    if (deliveredMessages.length === 0) {
        console.log('❌ No delivered messages found to test');
        console.log('Try sending a message first and having recipient connect');
        return;
    }

    console.log(`Found ${deliveredMessages.length} delivered messages`);

    // Mark them as read manually
    deliveredMessages.forEach((statusElement, index) => {
        const messageElement = statusElement.closest('.message');
        const messageId = messageElement.getAttribute('data-message-id');

        console.log(`Marking message ${messageId} as read...`);
        if (window.socket) {
            window.socket.emit('markMessagesRead', {
                messageIds: [parseInt(messageId)],
                chatId: window.currentChatId || window.chatId
            });
        }
    });

    console.log('✅ Sent read status updates - check if circles turn bright gold!');
}

// Auto-run the test
testReadStatus();
