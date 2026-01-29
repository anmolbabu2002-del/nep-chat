// COMPREHENSIVE STATUS INDICATOR DEBUG
console.log('🔬 COMPREHENSIVE STATUS DEBUG');
console.log('==============================');

// 1. Check URL parameters
console.log('🌐 URL ANALYSIS:');
const urlParams = new URLSearchParams(window.location.search);
console.log('Full URL:', window.location.href);
console.log('URL Params:');
for (const [key, value] of urlParams) {
    console.log(`   ${key}: ${value}`);
}

// 2. Check localStorage values
console.log('\n💾 LOCALSTORAGE VALUES:');
const ls_username = localStorage.getItem('user_username');
const ls_uid = localStorage.getItem('user_uid');
const ls_name = localStorage.getItem('user_name');
const ls_session = localStorage.getItem('user_sessionId');

console.log('user_username:', ls_username);
console.log('user_uid:', ls_uid);
console.log('user_name:', ls_name);
console.log('user_sessionId:', ls_session);

// 3. Check currentUser object
console.log('\n👤 CURRENT USER OBJECT:');
console.log('currentUser:', currentUser);
if (currentUser) {
    console.log('currentUser.uid:', currentUser.uid);
    console.log('currentUser.uid type:', typeof currentUser.uid);
    console.log('currentUser.name:', currentUser.name);
    console.log('currentUser.username:', currentUser.username);
}

// 4. Check target user from URL
console.log('\n🎯 TARGET USER FROM URL:');
const urlUid = urlParams.get('uid');
const urlName = urlParams.get('name');
console.log('URL uid:', urlUid);
console.log('URL name:', decodeURIComponent(urlName || ''));

// 5. Check recent messages and their ownership
console.log('\n💬 MESSAGE OWNERSHIP ANALYSIS:');
const messages = document.querySelectorAll('.message');
messages.forEach((msg, index) => {
    const msgId = msg.getAttribute('data-message-id');
    const isSent = msg.classList.contains('sent');
    const isReceived = msg.classList.contains('received');

    console.log(`Message ${index + 1} (ID: ${msgId}):`);
    console.log(`   CSS Class: ${isSent ? 'sent' : isReceived ? 'received' : 'unknown'}`);
    console.log(`   Should have status: ${isSent ? 'YES' : 'NO'}`);

    if (isSent) {
        const statusEl = msg.querySelector('.message-status');
        console.log(`   Has status element: ${!!statusEl}`);
        if (statusEl) {
            console.log(`   Status HTML: ${statusEl.outerHTML}`);
        } else {
            console.log(`   ❌ MISSING STATUS ELEMENT!`);
        }
    }
});

// 6. Test ownership logic manually
console.log('\n🧪 OWNERSHIP LOGIC TEST:');
if (currentUser?.uid && messages.length > 0) {
    const firstMsg = messages[0];
    const msgId = firstMsg.getAttribute('data-message-id');

    // We can't easily get the senderUid from DOM, so let's test the logic
    console.log('Current user UID:', currentUser.uid);
    console.log('Sample ownership check would be: senderUid === currentUser.uid');

    // Test with sample values
    const testSenderUids = [currentUser.uid, 'different-uid', ls_uid];
    testSenderUids.forEach(testUid => {
        const wouldBeOwn = testUid === currentUser.uid;
        console.log(`Test senderUid "${testUid}" === currentUser.uid "${currentUser.uid}": ${wouldBeOwn}`);
    });
}

// 7. Check if status icons are working at all
console.log('\n🎨 STATUS ICON TEST:');
try {
    const testIcons = {
        sent: getStatusIcon('sent'),
        delivered: getStatusIcon('delivered'),
        read: getStatusIcon('read')
    };

    console.log('Generated icons:');
    Object.entries(testIcons).forEach(([status, html]) => {
        console.log(`   ${status}: ${html}`);
    });

    // Test if they render
    const testDiv = document.createElement('div');
    testDiv.innerHTML = testIcons.sent;
    testDiv.style.position = 'absolute';
    testDiv.style.top = '-100px';
    document.body.appendChild(testDiv);

    const renderedIcon = testDiv.querySelector('.message-status');
    console.log(`Rendered icon visible: ${renderedIcon ? 'YES' : 'NO'}`);
    if (renderedIcon) {
        const style = getComputedStyle(renderedIcon);
        console.log(`Icon display: ${style.display}, visibility: ${style.visibility}`);
    }

    document.body.removeChild(testDiv);

} catch (error) {
    console.log('❌ Error testing icons:', error);
}

// 8. Socket.IO status
console.log('\n🔌 SOCKET.IO STATUS:');
if (typeof socket !== 'undefined') {
    console.log('Socket connected:', socket.connected);
    console.log('Socket ID:', socket.id);
} else {
    console.log('❌ Socket not initialized');
}

// 9. Summary and recommendations
console.log('\n🎯 SUMMARY & RECOMMENDATIONS:');

const issues = [];
const sentMessages = document.querySelectorAll('.message.sent');
const messagesWithStatus = document.querySelectorAll('.message.sent .message-status');

if (sentMessages.length === 0) {
    issues.push('No sent messages found - status indicators only appear on sent messages');
}

if (sentMessages.length > 0 && messagesWithStatus.length === 0) {
    issues.push('Sent messages exist but no status elements found - ownership detection issue');
}

if (!currentUser?.uid) {
    issues.push('currentUser.uid not set - check localStorage and URL params');
}

if (issues.length === 0) {
    console.log('✅ No obvious issues detected');
    console.log('💡 Status indicators should be working');
    console.log('🔍 Check if they are visible (not hidden by CSS)');
} else {
    console.log('❌ Issues found:');
    issues.forEach(issue => console.log(`   • ${issue}`));
}

console.log('\n🚀 NEXT STEPS:');
console.log('1. Send a new message and check if status appears');
console.log('2. Check browser console for any errors');
console.log('3. Verify localStorage values are correct');
console.log('4. Try refreshing the page');
