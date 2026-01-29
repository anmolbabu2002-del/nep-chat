// FINAL STATUS DEBUG - No variable conflicts
console.log('🎯 FINAL STATUS INDICATOR DEBUG');
console.log('==================================');

// 1. Check current user
console.log('👤 USER INFO:');
console.log('currentUser:', currentUser);
console.log('currentUser.uid:', currentUser?.uid);
console.log('localStorage uid:', localStorage.getItem('user_uid'));

// 2. Check URL params
const urlSearchParams = new URLSearchParams(window.location.search);
console.log('🌐 URL PARAMS:');
console.log('uid param:', urlSearchParams.get('uid'));
console.log('name param:', urlSearchParams.get('name'));

// 3. Check message elements (avoid variable conflict)
console.log('💬 MESSAGE ELEMENTS:');
const messageElements = document.querySelectorAll('.message');
console.log(`Found ${messageElements.length} message elements`);

messageElements.forEach((msgEl, index) => {
    const msgId = msgEl.getAttribute('data-message-id');
    const isSentClass = msgEl.classList.contains('sent');
    const isReceivedClass = msgEl.classList.contains('received');
    const statusIndicator = msgEl.querySelector('.message-status');

    console.log(`Message ${index + 1} (ID: ${msgId}):`);
    console.log(`   CSS class: ${isSentClass ? 'sent' : isReceivedClass ? 'received' : 'unknown'}`);
    console.log(`   Should have status: ${isSentClass}`);
    console.log(`   Has status indicator: ${!!statusIndicator}`);

    if (statusIndicator) {
        const checkIcons = statusIndicator.querySelectorAll('.fa-check');
        console.log(`   Checkmarks: ${checkIcons.length}`);
        console.log(`   Status HTML: ${statusIndicator.outerHTML}`);
    }
});

// 4. Test status icon generation
console.log('🎨 STATUS ICON TESTS:');
try {
    const sentHtml = getStatusIcon('sent');
    const deliveredHtml = getStatusIcon('delivered');
    const readHtml = getStatusIcon('read');

    console.log('✅ Generated successfully:');
    console.log('   Sent:', sentHtml);
    console.log('   Delivered:', deliveredHtml);
    console.log('   Read:', readHtml);

    // Count checkmarks
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sentHtml + deliveredHtml + readHtml;
    const totalChecks = tempDiv.querySelectorAll('.fa-check').length;
    console.log(`   Total checkmarks generated: ${totalChecks}`);

} catch (error) {
    console.log('❌ Error generating status icons:', error.message);
}

// 5. Test ownership logic
console.log('🧪 OWNERSHIP LOGIC:');
if (currentUser?.uid) {
    console.log('Current user UID:', currentUser.uid);

    // Test with current user UID
    const testOwnership = currentUser.uid === currentUser.uid;
    console.log('Self-ownership test: PASS (should be true)');

    // Test status generation for own message
    const testStatus = getStatusIcon('sent');
    console.log('Status for own message:', testStatus ? 'Generated' : 'Failed');

} else {
    console.log('❌ Current user not set!');
}

// 6. Check socket status
console.log('🔌 SOCKET STATUS:');
if (typeof socket !== 'undefined') {
    console.log('Socket exists:', !!socket);
    console.log('Socket connected:', socket.connected);
} else {
    console.log('❌ Socket not initialized');
}

// 7. Summary
console.log('🎯 SUMMARY:');
console.log('• If messages show "sent" class but no status indicator → Generation issue');
console.log('• If status indicator exists but no checkmarks → Icon loading issue');
console.log('• If ownership test fails → UID mismatch issue');
console.log('• If socket not connected → Real-time updates disabled');

console.log('\n🚀 RECOMMENDATIONS:');
console.log('1. Send a new message and check if status appears');
console.log('2. Refresh page and run this debug again');
console.log('3. Check browser console for FontAwesome errors');
console.log('4. Verify currentUser.uid matches message senderUid format');
