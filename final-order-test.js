// FINAL MESSAGE ORDER TEST - After All Fixes
console.log('🎯 FINAL MESSAGE ORDER TEST');
console.log('=============================');

// Check if on chat page
if (!window.location.pathname.includes('chat.html')) {
    console.log('❌ Please navigate to a chat page first');
    return;
}

console.log('📍 Testing message ordering after refresh...');
console.log('Please refresh the page now and watch the console...\n');

// Monitor message loading
let loadedMessages = [];
const originalDisplayMessage = window.displayMessage;

window.displayMessage = function(message) {
    loadedMessages.push({
        id: message.id,
        hasImage: !!message.fileUrl,
        timestamp: message.timestamp
    });

    console.log(`📨 Loaded: ID ${message.id} ${message.fileUrl ? '[IMAGE]' : '[TEXT]'} - ${new Date(message.timestamp).toLocaleTimeString()}`);

    if (originalDisplayMessage) {
        originalDisplayMessage(message);
    }
};

// Check final order after loading completes
setTimeout(() => {
    console.log('\n📊 FINAL RESULTS:');

    const totalMessages = document.querySelectorAll('.message').length;
    const imageMessages = loadedMessages.filter(m => m.hasImage);

    console.log(`📨 Total messages loaded: ${totalMessages}`);
    console.log(`🖼️ Messages with images: ${imageMessages.length}`);

    if (imageMessages.length > 0) {
        const firstImage = imageMessages[0];
        const lastImage = imageMessages[imageMessages.length - 1];

        console.log(`\n🖼️ Image message details:`);
        imageMessages.forEach((img, index) => {
            console.log(`   ${index + 1}. ID ${img.id} - ${new Date(img.timestamp).toLocaleTimeString()}`);
        });

        // Check if images are in chronological order (higher IDs = more recent)
        const imageIds = imageMessages.map(m => m.id);
        const isOrdered = imageIds.every((id, index) => index === 0 || id >= imageIds[index - 1]);

        console.log(`\n📋 Ordering Analysis:`);
        console.log(`   Image IDs: [${imageIds.join(', ')}]`);
        console.log(`   Chronologically ordered: ${isOrdered ? '✅ YES' : '❌ NO'}`);

        // Check DOM positions - find message element containing each image
        const allMessagesInDom = Array.from(document.querySelectorAll('.message'));
        const imagePositions = imageMessages.map(imgMsg => {
            // Find the message element by data-message-id
            const domElement = allMessagesInDom.find(m => m.getAttribute('data-message-id') == imgMsg.id);
            return domElement ? allMessagesInDom.indexOf(domElement) + 1 : -1;
        }).filter(pos => pos > 0);

        console.log(`   Image positions in chat: [${imagePositions.join(', ')}]`);
        console.log(`   Total messages in chat: ${totalMessages}`);

        // Determine if ordering is correct
        const lastImagePosition = Math.max(...imagePositions);
        const isAtBottom = lastImagePosition > totalMessages * 0.7; // In bottom 30%

        console.log(`\n🎯 CONCLUSION:`);
        if (isOrdered && isAtBottom) {
            console.log(`   ✅ SUCCESS: Images are properly ordered and positioned!`);
            console.log(`   ✅ Images appear chronologically (most recent at bottom)`);
        } else if (!isOrdered) {
            console.log(`   ❌ ISSUE: Images are not in chronological order`);
        } else if (!isAtBottom) {
            console.log(`   ⚠️ WARNING: Images may not be at the bottom of chat`);
        }
    } else {
        console.log(`ℹ️ No image messages found in this chat`);
    }

    console.log('\n🔄 REFRESH AGAIN TO VERIFY:');
    console.log('If images were recently sent, they should appear at the bottom after refresh!');

}, 3000);
