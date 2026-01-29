// Quick test for read status functionality
// Run this in browser console on chat page

console.log('🧪 TESTING READ STATUS FUNCTIONALITY');
console.log('=====================================');

// Check if functions exist
console.log('✅ markVisibleMessagesAsRead function:', typeof window.markVisibleMessagesAsRead === 'function');
console.log('✅ markMessageAsRead function:', typeof window.markMessageAsRead === 'function');

// Find sent messages
const sentMessages = document.querySelectorAll('.message.sent');
console.log(`📨 Found ${sentMessages.length} sent messages`);

// Test marking one message as read manually
if (sentMessages.length > 0) {
    const firstMsg = sentMessages[0];
    const msgId = firstMsg.getAttribute('data-message-id');
    console.log(`🎯 Testing with message ID: ${msgId}`);

    // Check current status
    const currentStatus = firstMsg.querySelector('.message-status');
    console.log('📊 Current status HTML:', currentStatus ? currentStatus.outerHTML : 'NONE');

    // Mark as read
    console.log('🔄 Marking as read...');
    window.markMessageAsRead(parseInt(msgId));

    // Check after 2 seconds
    setTimeout(() => {
        const updatedStatus = firstMsg.querySelector('.message-status');
        console.log('📊 Status after update:', updatedStatus ? updatedStatus.outerHTML : 'NONE');
        console.log('🎉 If status changed to blue double-checks, read status is working!');
    }, 2000);
} else {
    console.log('❌ No sent messages found to test with');
}

// Test marking all visible messages as read
setTimeout(() => {
    console.log('🔄 Testing markVisibleMessagesAsRead...');
    window.markVisibleMessagesAsRead();
}, 3000);

console.log('🎯 Check the results above!');
