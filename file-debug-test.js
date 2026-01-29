// Comprehensive File Debug Test
console.log('🔍 FILE DEBUG TEST');
console.log('==================');

// Test 1: Check if we're on the chat page
if (!window.location.pathname.includes('chat.html')) {
    console.log('❌ Not on chat page - please navigate to a chat');
    console.log('📝 Go to http://localhost:3000 and login, then open a chat');
    return;
}

// Test 2: Check current user and session
const currentUser = JSON.parse(localStorage.getItem('user_uid') || 'null');
const sessionId = localStorage.getItem('user_sessionId');

console.log('👤 Current User:', currentUser);
console.log('🔑 Session ID:', sessionId ? sessionId.substring(0, 20) + '...' : 'None');

// Test 3: Check for existing file messages in DOM
const messages = document.querySelectorAll('.message');
console.log(`📨 Found ${messages.length} messages in DOM`);

messages.forEach((msg, index) => {
    const messageId = msg.getAttribute('data-message-id');
    const img = msg.querySelector('img');
    const video = msg.querySelector('video');
    const fileLink = msg.querySelector('.file-download');

    if (img) {
        console.log(`🖼️ Message ${messageId}: Image found - ${img.src}`);
        img.addEventListener('load', () => console.log(`✅ Image loaded: ${img.src}`));
        img.addEventListener('error', (e) => console.log(`❌ Image failed: ${img.src}`, e));
    } else if (video) {
        console.log(`🎥 Message ${messageId}: Video found - ${video.querySelector('source')?.src}`);
    } else if (fileLink) {
        console.log(`📎 Message ${messageId}: File link found - ${fileLink.href}`);
    } else {
        const text = msg.querySelector('p')?.textContent;
        console.log(`💬 Message ${messageId}: Text only - "${text?.substring(0, 50)}..."`);
    }
});

// Test 4: Test file URL directly
console.log('\n🌐 TESTING FILE URL ACCESS:');
const testUrls = [
    'http://localhost:3000/uploads/1767740460370-148665123.jpg',
    '/uploads/1767740460370-148665123.jpg'
];

testUrls.forEach(url => {
    fetch(url, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                console.log(`✅ ${url} - Accessible (${response.status})`);
            } else {
                console.log(`❌ ${url} - Failed (${response.status})`);
            }
        })
        .catch(error => {
            console.log(`❌ ${url} - Error: ${error.message}`);
        });
});

// Test 5: Check Socket.IO connection
console.log('\n🔌 SOCKET.IO STATUS:');
if (typeof io !== 'undefined') {
    console.log('✅ Socket.IO library loaded');
} else {
    console.log('❌ Socket.IO library not loaded');
}

if (typeof socket !== 'undefined') {
    console.log(`✅ Socket connected: ${socket.connected}`);
    console.log(`✅ Socket ID: ${socket.id}`);
} else {
    console.log('❌ Socket not initialized');
}

// Test 6: Check message loading
console.log('\n📨 MESSAGE LOADING TEST:');
setTimeout(() => {
    const newMessages = document.querySelectorAll('.message');
    console.log(`📨 Messages after load: ${newMessages.length}`);

    newMessages.forEach((msg, index) => {
        const messageId = msg.getAttribute('data-message-id');
        const img = msg.querySelector('img');
        if (img) {
            console.log(`🖼️ Message ${messageId}: Image src="${img.src}"`);
            // Force reload
            const originalSrc = img.src;
            img.src = '';
            setTimeout(() => {
                img.src = originalSrc;
                console.log(`🔄 Reloaded image: ${originalSrc}`);
            }, 100);
        }
    });
}, 2000);

// Test 7: Manual file request
console.log('\n📁 MANUAL FILE REQUEST:');
setTimeout(() => {
    fetch('/uploads/1767740460370-148665123.jpg')
        .then(response => {
            console.log(`📁 Manual request status: ${response.status}`);
            if (response.ok) {
                console.log('📁 File is accessible via fetch');
            } else {
                console.log('📁 File not accessible via fetch');
            }
        })
        .catch(error => {
            console.log(`📁 Fetch error: ${error.message}`);
        });
}, 1000);

console.log('\n🎯 SUMMARY:');
console.log('==================');
console.log('This test will show:');
console.log('1. How many messages are loaded');
console.log('2. Which messages have files');
console.log('3. If file URLs are accessible');
console.log('4. If images load properly');
console.log('5. Socket connection status');
console.log('');
console.log('Check browser console for detailed results!');
