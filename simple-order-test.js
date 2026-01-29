// SIMPLE ORDER TEST - Direct DOM check
console.log('🎯 SIMPLE MESSAGE ORDER TEST');
console.log('==============================');

setTimeout(() => {
    // Get all messages
    const allMessages = document.querySelectorAll('.message');
    console.log(`📨 Total messages: ${allMessages.length}`);

    // Find messages with images
    const imageMessages = Array.from(allMessages).filter(msg => msg.querySelector('img'));
    console.log(`🖼️ Messages with images: ${imageMessages.length}`);

    if (imageMessages.length > 0) {
        // Get positions (1-indexed)
        const positions = imageMessages.map((msg, index) => {
            const position = Array.from(allMessages).indexOf(msg) + 1;
            const msgId = msg.getAttribute('data-message-id');
            return { position, msgId, index: index + 1 };
        });

        console.log('\n📍 Image positions:');
        positions.forEach(p => {
            console.log(`   Image ${p.index}: Position ${p.position}/${allMessages.length} (ID: ${p.msgId})`);
        });

        // Check if latest images are at bottom
        const lastPosition = Math.max(...positions.map(p => p.position));
        const isAtBottom = lastPosition > allMessages.length * 0.7;

        console.log(`\n🎯 RESULT:`);
        console.log(`   Last image at: ${lastPosition}/${allMessages.length}`);
        console.log(`   At bottom: ${isAtBottom ? '✅ YES' : '❌ NO'}`);

        if (isAtBottom) {
            console.log(`   ✅ SUCCESS: Images are correctly positioned!`);
        } else {
            console.log(`   ❌ FAILED: Images should be closer to position ${allMessages.length}`);
        }
    } else {
        console.log('ℹ️ No images found in current chat');
    }
}, 2000);
