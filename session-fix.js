// Fix invalid session issue
// Run this to clear invalid session and redirect to login

console.log('🔧 SESSION FIX');
console.log('===============');

// 1. Check current session
const currentSessionId = localStorage.getItem('user_sessionId');
console.log('📋 Current session ID:', currentSessionId ? currentSessionId.substring(0, 15) + '...' : 'None');

// 2. Clear invalid session data
console.log('🗑️ Clearing invalid session data...');
localStorage.removeItem('user_sessionId');
localStorage.removeItem('user_uid');
localStorage.removeItem('user_name');

// 3. Verify cleared
const afterClear = localStorage.getItem('user_sessionId');
console.log('✅ Session data cleared:', !afterClear);

// 4. Redirect to login
console.log('🔄 Redirecting to login page...');
console.log('Please log in again to create a new valid session.');

setTimeout(() => {
    window.location.href = 'login.html';
}, 2000);
