// FINAL IMAGE LOADING TEST - Comprehensive
console.log('🎯 FINAL IMAGE LOADING TEST');
console.log('===============================');

// Test 1: Check if we're on the right page
if (!window.location.pathname.includes('chat.html')) {
    console.log('❌ Please navigate to a chat page first');
    return;
}

// Test 2: Monitor image loading in real-time
console.log('\n📸 MONITORING IMAGE LOADING...');

let imageLoadCount = 0;
let imageErrorCount = 0;

// Override the handleImageError function to track errors
const originalHandleImageError = window.handleImageError;
window.handleImageError = function(img, url) {
    imageErrorCount++;
    console.error(`❌ Image error #${imageErrorCount}:`, url);
    if (originalHandleImageError) {
        originalHandleImageError(img, url);
    }
};

// Monitor all images
const allImages = document.querySelectorAll('img');
console.log(`👀 Found ${allImages.length} images on page`);

allImages.forEach((img, index) => {
    // Remove existing listeners to avoid duplicates
    img.removeEventListener('load', img._loadListener);
    img.removeEventListener('error', img._errorListener);

    // Add new listeners
    img._loadListener = function() {
        imageLoadCount++;
        console.log(`✅ Image #${imageLoadCount} loaded:`, this.src);
    };

    img._errorListener = function() {
        imageErrorCount++;
        console.error(`❌ Image error #${imageErrorCount}:`, this.src);
    };

    img.addEventListener('load', img._loadListener);
    img.addEventListener('error', img._errorListener);

    // Check current status
    if (img.complete) {
        if (img.naturalWidth > 0) {
            console.log(`📸 Image ${index + 1} already loaded:`, img.src);
        } else {
            console.error(`📸 Image ${index + 1} failed to load:`, img.src);
        }
    }
});

// Test 3: Check message loading
console.log('\n💬 CHECKING MESSAGE LOADING...');

const messageObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.classList && node.classList.contains('message')) {
                const img = node.querySelector('img');
                if (img) {
                    console.log('🆕 New message with image added:', img.src);
                }
            }
        });
    });
});

const messagesContainer = document.querySelector('.messages');
if (messagesContainer) {
    messageObserver.observe(messagesContainer, { childList: true, subtree: true });
    console.log('👁️ Message observer active');
}

// Test 4: Force refresh test
console.log('\n🔄 REFRESH TEST:');
console.log('Please refresh the page now (Ctrl+F5) and watch the console...');

setTimeout(() => {
    console.log('\n📊 REFRESH TEST RESULTS:');
    console.log(`Images loaded: ${imageLoadCount}`);
    console.log(`Image errors: ${imageErrorCount}`);

    if (imageErrorCount === 0) {
        console.log('🎉 SUCCESS: No image errors after refresh!');
    } else {
        console.log('⚠️ ISSUES: Some images failed to load');
        console.log('💡 Try: Clear browser cache, check network tab');
    }
}, 3000);

// Test 5: Manual image checks
console.log('\n🔍 MANUAL IMAGE CHECKS:');
setTimeout(() => {
    const currentImages = document.querySelectorAll('img');
    console.log(`Current images: ${currentImages.length}`);

    currentImages.forEach((img, i) => {
        console.log(`Image ${i + 1}: ${img.complete ? 'Complete' : 'Loading'}, Size: ${img.naturalWidth}x${img.naturalHeight}, Src: ${img.src}`);
    });
}, 1000);

console.log('\n🎯 TEST COMPLETE - Refresh the page to see results!');
