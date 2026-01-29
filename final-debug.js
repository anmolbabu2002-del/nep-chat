// FINAL DEBUGGING - No variable conflicts
console.log('🎯 FINAL IMAGE DEBUGGING - NO CONFLICTS');
console.log('==========================================');

// Check current page
console.log('📍 Page:', window.location.pathname);
console.log('🔗 URL:', window.location.href);

// Check connections
console.log('\n🔌 CONNECTIONS:');
if (typeof socket !== 'undefined') {
    console.log('✅ Socket.IO: Loaded');
    console.log('🔌 Connected:', socket.connected);
} else {
    console.log('❌ Socket.IO: Not loaded');
}

// Check session data (use different variable names)
const storedSessionId = localStorage.getItem('user_sessionId');
const storedUserData = localStorage.getItem('user_uid');
console.log('🔑 Session:', storedSessionId ? 'Present' : '❌ Missing');
console.log('👤 User Data:', storedUserData || '❌ Not set');

// Check messages
console.log('\n💬 MESSAGES:');
const messageElements = document.querySelectorAll('.message');
console.log(`📨 Found: ${messageElements.length} messages`);

messageElements.forEach((msgEl, index) => {
    const msgId = msgEl.getAttribute('data-message-id');
    const hasImage = !!msgEl.querySelector('img');
    const hasVideo = !!msgEl.querySelector('video');
    const hasFile = !!msgEl.querySelector('.file-download');

    console.log(`💬 Message ${index + 1} (${msgId || 'no-id'}):`, {
        image: hasImage,
        video: hasVideo,
        file: hasFile
    });

    // Check image specifically
    const imgElement = msgEl.querySelector('img');
    if (imgElement) {
        console.log(`   🖼️ Image:`, {
            src: imgElement.src,
            loaded: imgElement.complete,
            broken: imgElement.naturalWidth === 0 && imgElement.complete,
            size: `${imgElement.naturalWidth}x${imgElement.naturalHeight}`
        });
    }
});

// Test file access
console.log('\n🌐 FILE ACCESS TESTS:');
const testImageUrls = [
    'http://localhost:3000/uploads/1767741675952-921287566.jpg',
    'http://localhost:3000/uploads/1767741626927-140987457.jpg'
];

testImageUrls.forEach((url, index) => {
    console.log(`📁 Test ${index + 1}: ${url}`);
    fetch(url, { method: 'HEAD' })
        .then(response => {
            console.log(`   ✅ Status: ${response.status} (${response.ok ? 'OK' : 'Failed'})`);
        })
        .catch(error => {
            console.log(`   ❌ Error: ${error.message}`);
        });
});

// Force image reload
console.log('\n🔄 FORCING IMAGE RELOAD:');
setTimeout(() => {
    const allImages = document.querySelectorAll('img');
    console.log(`🔄 Reloading ${allImages.length} images...`);

    allImages.forEach((img, i) => {
        const originalUrl = img.src;
        img.src = '';
        setTimeout(() => {
            img.src = originalUrl;
            console.log(`   ✅ Reloaded image ${i + 1}`);
        }, 100);
    });
}, 2000);

// Summary
console.log('\n🎯 SUMMARY:');
console.log('• If images show "broken: true" → Loading failed');
console.log('• If HTTP status is 404 → File not found');
console.log('• If HTTP status is 200 → File exists but not displaying');
console.log('• Hard refresh (Ctrl+F5) often fixes cache issues');

console.log('\n🚀 Try: Ctrl+F5 hard refresh, then run this again!');
