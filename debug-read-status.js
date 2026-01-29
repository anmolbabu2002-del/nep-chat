// Debug read status functionality
// Run this in browser console on chat page

console.log('🔍 DEBUG: Read Status Investigation');
console.log('=====================================');

// 1. Check current user and chat
console.log('👤 Current User:', window.currentUser);
console.log('💬 Current Chat ID:', window.currentChatId);
console.log('🎯 Target User:', window.targetUser);

// 2. Check message elements and their status
const messageElements = document.querySelectorAll('.message.sent');
console.log('📨 Found sent messages:', messageElements.length);

messageElements.forEach((msg, index) => {
    const messageId = msg.getAttribute('data-message-id');
    const statusElement = msg.querySelector('.message-status');
    const statusClass = statusElement ? statusElement.className : 'NO STATUS ELEMENT';
    const statusText = statusElement ? statusElement.outerHTML : 'NO STATUS HTML';

    console.log(`Message ${index + 1} (ID: ${messageId}):`);
    console.log(`  - Status Class: ${statusClass}`);
    console.log(`  - Status HTML: ${statusText}`);
    console.log(`  - Is Visible: ${statusElement ? 'YES' : 'NO'}`);
});

// 3. Check socket connection and events
console.log('🔌 Socket Connected:', window.socket ? window.socket.connected : 'NO SOCKET');

// 4. Test manual status update
console.log('🧪 Testing manual status update...');
if (messageElements.length > 0) {
    const firstMessage = messageElements[0];
    console.log('Updating first message to "read" status...');
    window.updateMessageStatus(firstMessage, 'read');

    setTimeout(() => {
        const updatedStatus = firstMessage.querySelector('.message-status');
        console.log('After update - Status HTML:', updatedStatus ? updatedStatus.outerHTML : 'FAILED');
    }, 100);
}

// 5. Check server-side message status
console.log('📡 Testing server message status...');
fetch('/api/conversations', {
    method: 'GET',
    headers: {
        'x-session-id': localStorage.getItem('sessionId')
    }
})
.then(res => res.json())
.then(data => {
    console.log('Server conversations response:', data);

    if (data.conversations && data.conversations.length > 0) {
        const firstConv = data.conversations[0];
        console.log('First conversation details:', firstConv);

        // Load chat history for this conversation
        return fetch(`/api/chat/${firstConv.chatId}`, {
            method: 'GET',
            headers: {
                'x-session-id': localStorage.getItem('sessionId')
            }
        });
    }
})
.then(res => res ? res.json() : null)
.then(chatData => {
    if (chatData) {
        console.log('Chat history from server:', chatData);
        if (chatData.messages) {
            chatData.messages.forEach((msg, i) => {
                console.log(`Server Message ${i + 1}: ID=${msg.id}, Status=${msg.status}, Sender=${msg.senderUid}`);
            });
        }
    }
})
.catch(err => console.error('Error fetching data:', err));

console.log('🎯 DEBUG COMPLETE - Check the logs above for issues!');
