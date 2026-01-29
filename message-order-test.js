// Test Message Ordering After Timestamp Fix
console.log('📋 MESSAGE ORDERING TEST');
console.log('==========================');

// Check if we're on chat page
if (!window.location.pathname.includes('chat.html')) {
    console.log('❌ Navigate to chat page first');
    return;
}

// Check current messages in DOM
console.log('\n💬 CURRENT MESSAGES IN DOM:');
const messages = document.querySelectorAll('.message');
console.log(`Found ${messages.length} messages`);

messages.forEach((msg, index) => {
    const msgId = msg.getAttribute('data-message-id');
    const isImage = !!msg.querySelector('img');
    const text = msg.textContent.substring(0, 50).trim();
    console.log(`${index + 1}. ID:${msgId} ${isImage ? '[IMAGE]' : ''} "${text}"`);
});

// Test message loading order
console.log('\n🔄 TESTING MESSAGE LOADING ORDER:');
console.log('Please refresh the page now and check the console...');

let loadCount = 0;
const originalDisplayMessage = window.displayMessage;

window.displayMessage = function(message) {
    loadCount++;
    console.log(`📨 Loading message ${loadCount}: ID ${message.id}, Time: ${new Date(message.timestamp).toLocaleString()}`);
    if (message.fileUrl) {
        console.log(`   🖼️ Has image: ${message.fileUrl}`);
    }

    // Call original function
    if (originalDisplayMessage) {
        originalDisplayMessage(message);
    }
};

// Check final order after loading
setTimeout(() => {
    console.log('\n📊 FINAL MESSAGE ORDER:');
    const finalMessages = document.querySelectorAll('.message');
    console.log(`Total messages after load: ${finalMessages.length}`);

    finalMessages.forEach((msg, index) => {
        const msgId = msg.getAttribute('data-message-id');
        const isImage = !!msg.querySelector('img');
        console.log(`${index + 1}. ID:${msgId} ${isImage ? '[IMAGE]' : '[TEXT]'}`);
    });

    // Check if images are in correct position
    const imageMessages = Array.from(finalMessages).filter(msg => msg.querySelector('img'));
    if (imageMessages.length > 0) {
        const firstImageIndex = Array.from(finalMessages).indexOf(imageMessages[0]);
        const lastImageIndex = Array.from(finalMessages).indexOf(imageMessages[imageMessages.length - 1]);

        console.log(`\n🖼️ Image positions:`);
        console.log(`   First image at position: ${firstImageIndex + 1}`);
        console.log(`   Last image at position: ${lastImageIndex + 1}`);

        if (firstImageIndex === finalMessages.length - imageMessages.length) {
            console.log('✅ Images are at the BOTTOM (most recent) - CORRECT!');
        } else if (firstImageIndex === 0) {
            console.log('❌ Images are at the TOP - ORDER ISSUE!');
        } else {
            console.log('⚠️ Images are in the MIDDLE - may be correct depending on send order');
        }
    } else {
        console.log('ℹ️ No images found in current chat');
    }

}, 3000);

console.log('\n🎯 EXPECTED RESULT:');
console.log('Images should appear at the BOTTOM (most recent messages)');
console.log('Not at the TOP of the chat after refresh');
