// DEBUG STATUS INDICATOR VISIBILITY
console.log('🔍 DEBUGGING STATUS INDICATOR VISIBILITY');
console.log('==========================================');

// Check current user
console.log('👤 Current User Info:');
console.log('   currentUser:', currentUser);
console.log('   currentUser.uid:', currentUser?.uid);
console.log('   currentUser.uid type:', typeof currentUser?.uid);

// Check messages
const allMessages = document.querySelectorAll('.message');
console.log(`\n📨 Total messages: ${allMessages.length}`);

allMessages.forEach((msg, index) => {
    const msgId = msg.getAttribute('data-message-id');
    const isSent = msg.classList.contains('sent');
    const isReceived = msg.classList.contains('received');
    const statusElement = msg.querySelector('.message-status');
    const senderInfo = msg.querySelector('.sender-info, .message-sender');

    console.log(`\n💬 Message ${index + 1} (ID: ${msgId}):`);
    console.log(`   CSS Classes: ${msg.className}`);
    console.log(`   Is Sent: ${isSent}`);
    console.log(`   Is Received: ${isReceived}`);
    console.log(`   Has Status Element: ${!!statusElement}`);

    if (statusElement) {
        console.log(`   Status HTML: ${statusElement.outerHTML}`);
        const computedStyle = getComputedStyle(statusElement);
        console.log(`   Display: ${computedStyle.display}`);
        console.log(`   Visibility: ${computedStyle.visibility}`);
        console.log(`   Opacity: ${computedStyle.opacity}`);
    } else {
        console.log(`   ❌ NO STATUS ELEMENT FOUND`);
    }

    // Check if message should have status
    if (isSent) {
        console.log(`   ✅ This is a SENT message - SHOULD have status indicator`);
        if (!statusElement) {
            console.log(`   ❌ BUT no status element found!`);
        }
    } else {
        console.log(`   ℹ️ This is a RECEIVED message - no status indicator needed`);
    }
});

// Check if status icons are being generated
console.log('\n🎯 STATUS ICON GENERATION TEST:');
console.log('Generated status icons:');
console.log('Sent:', getStatusIcon('sent'));
console.log('Delivered:', getStatusIcon('delivered'));
console.log('Read:', getStatusIcon('read'));

// Test message ownership logic
console.log('\n👥 OWNERSHIP LOGIC TEST:');
if (currentUser?.uid) {
    console.log('Testing ownership with current user:', currentUser.uid);

    // Test with a sample message
    const testMessage = {
        id: 999,
        senderUid: currentUser.uid,
        text: 'test message',
        status: 'sent'
    };

    const wouldBeOwn = testMessage.senderUid === currentUser.uid;
    const wouldGetStatus = wouldBeOwn ? getStatusIcon(testMessage.status || 'sent') : '';

    console.log('Sample message ownership:');
    console.log('   senderUid:', testMessage.senderUid);
    console.log('   currentUser.uid:', currentUser.uid);
    console.log('   Would be own:', wouldBeOwn);
    console.log('   Would get status:', wouldGetStatus ? 'YES' : 'NO');
    if (wouldGetStatus) {
        console.log('   Status HTML:', wouldGetStatus);
    }
} else {
    console.log('❌ Current user not set properly!');
}

// Final summary
console.log('\n🎯 SUMMARY:');
console.log('If you see "NO STATUS ELEMENT FOUND" for sent messages,');
console.log('then the status indicators are not being added to the DOM.');
console.log('If you see status elements but they are invisible,');
console.log('then it\'s a CSS styling issue.');

console.log('\n🔧 POSSIBLE FIXES:');
console.log('1. Check if currentUser.uid matches message.senderUid format');
console.log('2. Verify message status is set to "sent", "delivered", or "read"');
console.log('3. Check CSS for .message-status visibility');
console.log('4. Ensure FontAwesome icons are loading');
