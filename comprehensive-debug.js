// COMPREHENSIVE IMAGE DEBUGGING
console.log('🔬 COMPREHENSIVE IMAGE DEBUGGING');
console.log('================================');

// 1. Check current page and setup
console.log('📍 Current page:', window.location.pathname);
console.log('🔗 Full URL:', window.location.href);

// 2. Check Socket.IO and user status
console.log('\n🔌 CONNECTION STATUS:');
if (typeof socket !== 'undefined') {
    console.log('✅ Socket.IO loaded');
    console.log('🔌 Connected:', socket.connected);
    console.log('🆔 Socket ID:', socket.id);
} else {
    console.log('❌ Socket.IO not loaded');
}

const sessionId = localStorage.getItem('user_sessionId');
const currentUser = localStorage.getItem('user_uid');
console.log('🔑 Session ID:', sessionId ? 'Present' : '❌ Missing');
console.log('👤 Current User:', currentUser || '❌ Not set');

// 3. Check messages in DOM
console.log('\n💬 MESSAGES IN DOM:');
const allMessages = document.querySelectorAll('.message');
console.log(`📨 Total messages: ${allMessages.length}`);

allMessages.forEach((msg, index) => {
    const messageId = msg.getAttribute('data-message-id');
    const isOwn = msg.classList.contains('sent');
    const img = msg.querySelector('img');
    const video = msg.querySelector('video');
    const fileLink = msg.querySelector('.file-download');

    console.log(`\n💬 Message ${index + 1} (ID: ${messageId || 'none'}):`);
    console.log(`   Direction: ${isOwn ? 'Sent' : 'Received'}`);
    console.log(`   Has Image: ${!!img}`);
    console.log(`   Has Video: ${!!video}`);
    console.log(`   Has File Link: ${!!fileLink}`);

    if (img) {
        console.log(`   🖼️ Image Details:`);
        console.log(`      SRC: ${img.src}`);
        console.log(`      Complete: ${img.complete}`);
        console.log(`      Natural Size: ${img.naturalWidth}x${img.naturalHeight}`);
        console.log(`      Display Size: ${img.width}x${img.height}`);
        console.log(`      Has Error: ${img.naturalWidth === 0 && img.complete}`);

        // Test direct fetch of image
        if (img.src) {
            fetch(img.src, { method: 'HEAD' })
                .then(response => {
                    console.log(`      🌐 HTTP Status: ${response.status}`);
                    console.log(`      🌐 Accessible: ${response.ok}`);
                })
                .catch(error => {
                    console.log(`      🌐 Fetch Error: ${error.message}`);
                });
        }
    }
});

// 4. Test direct file access
console.log('\n🌐 TESTING DIRECT FILE ACCESS:');
const testFiles = [
    '/uploads/1767741675952-921287566.jpg',
    '/uploads/1767741626927-140987457.jpg'
];

testFiles.forEach(fileUrl => {
    const fullUrl = `http://localhost:3000${fileUrl}`;
    console.log(`\n📁 Testing: ${fullUrl}`);

    fetch(fullUrl, { method: 'HEAD' })
        .then(response => {
            console.log(`   ✅ HTTP ${response.status}: ${response.ok ? 'Accessible' : 'Not accessible'}`);
            console.log(`   📄 Content-Type: ${response.headers.get('content-type')}`);
            console.log(`   📏 Content-Length: ${response.headers.get('content-length')}`);
        })
        .catch(error => {
            console.log(`   ❌ Network Error: ${error.message}`);
        });
});

// 5. Check for JavaScript errors that might affect image loading
console.log('\n🚨 CHECKING FOR ERRORS:');
console.log('If you see any errors above, they might be causing images to fail.');

// 6. Force reload images
console.log('\n🔄 ATTEMPTING IMAGE RELOAD:');
setTimeout(() => {
    const images = document.querySelectorAll('img');
    console.log(`🔄 Found ${images.length} images to reload`);

    images.forEach((img, index) => {
        const originalSrc = img.src;
        console.log(`🔄 Reloading image ${index + 1}: ${originalSrc}`);

        // Force reload by clearing and re-setting src
        img.src = '';
        setTimeout(() => {
            img.src = originalSrc;
            console.log(`   ✅ Reload triggered for: ${originalSrc}`);
        }, 100);
    });
}, 2000);

// 7. Recommendations
console.log('\n🎯 RECOMMENDATIONS:');
console.log('1. 🗑️ Clear browser cache (Ctrl+Shift+R)');
console.log('2. 🌐 Check Network tab in DevTools for failed requests');
console.log('3. 🔍 Look for CORS errors in console');
console.log('4. 📱 Try different browser');
console.log('5. 🔄 Hard refresh (Ctrl+F5)');

console.log('\n⏰ Run this again after refresh to compare!');
