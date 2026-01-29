// Complete diagnostic check for chat app
// Run this in browser console to see what's wrong

console.log('🔍 COMPLETE DIAGNOSTIC CHECK');
console.log('=============================');

// 1. Check what page we're on
console.log('📄 PAGE INFO:');
console.log('- Current URL:', window.location.href);
console.log('- Page title:', document.title);
console.log('- Is login page:', window.location.href.includes('login'));
console.log('- Is chat page:', window.location.href.includes('chat'));

// 2. Check authentication
console.log('\n🔐 AUTHENTICATION CHECK:');
const sessionId = localStorage.getItem('user_sessionId');
console.log('- Session ID in localStorage:', sessionId ? 'YES (' + sessionId.substring(0, 10) + '...)' : 'NO');

const urlParams = new URLSearchParams(window.location.search);
const uid = urlParams.get('uid');
const name = urlParams.get('name');
console.log('- URL parameters:');
console.log('  - uid:', uid);
console.log('  - name:', name);

// 3. Check JavaScript variables
console.log('\n📊 JAVASCRIPT VARIABLES:');
console.log('- window.currentUser:', window.currentUser);
console.log('- window.socket:', window.socket);
console.log('- window.targetUser:', window.targetUser);

// 4. Check Socket.IO library
console.log('\n🔌 SOCKET.IO CHECK:');
console.log('- io object exists:', typeof io !== 'undefined');
if (typeof io !== 'undefined') {
    console.log('- io version:', io.version || 'unknown');
} else {
    console.log('- Socket.IO script loaded:', !!document.querySelector('script[src*="/socket.io/socket.io.js"]'));
}

// 5. Check server connection
console.log('\n🌐 SERVER CONNECTION:');
fetch('http://localhost:3000')
    .then(response => {
        console.log('- Server reachable:', response.ok);
        console.log('- Response status:', response.status);
    })
    .catch(error => {
        console.log('- Server NOT reachable:', error.message);
    });

// 6. Give recommendations
console.log('\n💡 RECOMMENDATIONS:');

if (!window.location.href.includes('chat')) {
    console.log('❌ You are NOT on the chat page!');
    console.log('   → Go to http://localhost:3000');
    console.log('   → Log in with username/password');
    console.log('   → Click on a conversation');
} else if (!sessionId) {
    console.log('❌ No session ID found!');
    console.log('   → Log in again');
    console.log('   → Make sure login was successful');
} else if (!window.currentUser) {
    console.log('❌ currentUser not set!');
    console.log('   → Refresh the chat page');
    console.log('   → Or log in again');
} else if (!window.socket) {
    console.log('❌ Socket not initialized!');
    console.log('   → Check browser console for connection errors');
    console.log('   → Make sure server is running on port 3000');
} else if (window.socket && !window.socket.connected) {
    console.log('❌ Socket not connected!');
    console.log('   → Check network connection');
    console.log('   → Check server logs for errors');
} else {
    console.log('✅ Everything looks good!');
    console.log('   → Try running the WhatsApp delivery test now');
}

console.log('\n🎯 NEXT STEPS:');
console.log('1. Address any ❌ issues above');
console.log('2. If all ✅, run the delivery test script');
console.log('3. Report what you see in the console');
