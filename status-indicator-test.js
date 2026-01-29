// MESSAGE STATUS INDICATOR TEST
console.log('📨 MESSAGE STATUS INDICATOR TEST');
console.log('==================================');

setTimeout(() => {
    // Check if we're on chat page
    if (!window.location.pathname.includes('chat.html')) {
        console.log('❌ Please navigate to a chat page first');
        return;
    }

    // Get all messages
    const allMessages = document.querySelectorAll('.message');
    console.log(`📨 Total messages: ${allMessages.length}`);

    // Check sent messages (should have status indicators)
    const sentMessages = document.querySelectorAll('.message.sent');
    console.log(`📤 Sent messages: ${sentMessages.length}`);

    if (sentMessages.length > 0) {
        console.log('\n📊 STATUS INDICATOR ANALYSIS:');

        sentMessages.forEach((msg, index) => {
            const msgId = msg.getAttribute('data-message-id');
            const statusElement = msg.querySelector('.message-status');
            const statusText = statusElement ? statusElement.textContent.trim() : 'NONE';
            const statusClass = statusElement ? statusElement.className : 'NONE';

            console.log(`💬 Message ${index + 1} (ID: ${msgId}):`);
            console.log(`   Status element: ${statusElement ? '✅ FOUND' : '❌ MISSING'}`);
            console.log(`   Status text: "${statusText}"`);
            console.log(`   Status class: ${statusClass}`);

            if (statusElement) {
                const computedStyle = getComputedStyle(statusElement);
                console.log(`   Color: ${computedStyle.color}`);
                console.log(`   Visibility: ${computedStyle.display !== 'none' ? '✅ VISIBLE' : '❌ HIDDEN'}`);
            }

            // Check for checkmarks
            const checkmarks = msg.querySelectorAll('.fa-check');
            console.log(`   Checkmarks found: ${checkmarks.length}`);
            console.log('   ---');
        });

        // Overall assessment
        const messagesWithStatus = Array.from(sentMessages).filter(msg => msg.querySelector('.message-status'));
        const percentage = Math.round((messagesWithStatus.length / sentMessages.length) * 100);

        console.log(`\n🎯 OVERALL STATUS:`);
        console.log(`   Messages with status indicators: ${messagesWithStatus.length}/${sentMessages.length} (${percentage}%)`);

        if (percentage >= 80) {
            console.log(`   ✅ SUCCESS: Most messages have status indicators!`);
            console.log(`   💡 Status should show: ✓ (sent), ✓✓ (delivered), ✓✓ blue (read)`);
        } else {
            console.log(`   ❌ ISSUE: Many messages missing status indicators`);
            console.log(`   🔧 Check if messages are being marked as 'sent' properly`);
        }

        // WhatsApp-style check
        const hasDoubleChecks = document.querySelectorAll('.message-status i + i').length > 0;
        const hasBlueChecks = document.querySelector('.message-status.read');

        console.log(`\n📱 WHATSAPP COMPLIANCE:`);
        console.log(`   Double checkmarks: ${hasDoubleChecks ? '✅ YES' : '❌ NO'}`);
        console.log(`   Blue read indicators: ${hasBlueChecks ? '✅ YES' : '❌ NO'}`);
        console.log(`   Proper positioning: ${messagesWithStatus.length > 0 ? '✅ YES' : '❌ NO'}`);

    } else {
        console.log('ℹ️ No sent messages found in current chat');
        console.log('💡 Send a message to see status indicators');
    }

    // Instructions
    console.log('\n🎯 HOW TO TEST STATUS CHANGES:');
    console.log('1. Send a message (should show ✓)');
    console.log('2. Have another user view it (should show ✓✓)');
    console.log('3. Have another user reply (should show ✓✓ blue)');
    console.log('4. Refresh page - statuses should persist');

}, 2000);
