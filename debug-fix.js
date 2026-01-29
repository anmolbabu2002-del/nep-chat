// Fixed debugging code - avoid variable name conflicts
console.log('🔍 DEBUGGING FILE DISPLAY (FIXED)...');

// Use different variable names to avoid conflicts
const chatMessages = document.querySelectorAll('.message');
console.log(`📨 Found ${chatMessages.length} messages in chat`);

chatMessages.forEach((msg, i) => {
    const messageId = msg.getAttribute('data-message-id');
    const img = msg.querySelector('img');
    const video = msg.querySelector('video');
    const fileLink = msg.querySelector('.file-download');

    console.log(`💬 Message ${messageId || i}:`, {
        hasImage: !!img,
        hasVideo: !!video,
        hasFileLink: !!fileLink,
        content: msg.textContent.substring(0, 50) + '...'
    });

    if (img) {
        console.log(`🖼️ Image details:`, {
            src: img.src,
            loaded: img.complete,
            hasError: img.naturalWidth === 0,
            width: img.naturalWidth,
            height: img.naturalHeight
        });

        // Add error listener if not already added
        if (!img.hasAttribute('data-debug-listener')) {
            img.setAttribute('data-debug-listener', 'true');
            img.addEventListener('load', () => console.log(`✅ Image loaded: ${img.src}`));
            img.addEventListener('error', (e) => console.log(`❌ Image failed: ${img.src}`, e));
        }
    }

    if (video) {
        console.log(`🎥 Video details:`, {
            src: video.querySelector('source')?.src,
            readyState: video.readyState
        });
    }
});

// Check if we're on the right page
console.log('📍 Current page:', window.location.pathname);
console.log('🔗 Current URL:', window.location.href);

// Check Socket.IO status
if (typeof socket !== 'undefined') {
    console.log('🔌 Socket status:', socket.connected ? 'Connected' : 'Disconnected');
} else {
    console.log('❌ Socket.IO not loaded');
}

// Check localStorage
const sessionId = localStorage.getItem('user_sessionId');
const currentUser = localStorage.getItem('user_uid');
console.log('🔑 Session ID:', sessionId ? 'Present' : 'Missing');
console.log('👤 Current User:', currentUser || 'Not set');

console.log('\n🎯 SUMMARY:');
console.log('Check the logs above for image loading status!');
console.log('If images show "hasError: true", they failed to load.');
console.log('Hard refresh (Ctrl+F5) might fix caching issues.');
