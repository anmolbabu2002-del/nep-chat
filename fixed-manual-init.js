// FIXED: Manual initialization (no return statements)
// Run this in browser console

console.log('🔧 MANUAL INITIALIZATION FIX');

// 1. Check URL parameters
const urlParams = new URLSearchParams(window.location.search);
const uid = urlParams.get('uid');
const name = urlParams.get('name');
console.log('📋 URL params - uid:', uid, 'name:', name);

// 2. Set currentUser manually
if (!uid || !name) {
    console.log('❌ Missing URL parameters - cannot set currentUser');
    console.log('Make sure you are on a chat page with uid and name parameters');
} else {
    window.currentUser = {
        uid: uid,
        name: decodeURIComponent(name),
        username: 'unknown'
    };
    console.log('✅ currentUser set:', window.currentUser);

    // 3. Get session ID
    const sessionId = localStorage.getItem('user_sessionId');
    console.log('🔐 Session ID:', sessionId ? 'Found' : 'Missing');

    // 4. Create socket connection
    if (typeof io === 'undefined') {
        console.log('❌ Socket.IO not loaded');
    } else if (!sessionId) {
        console.log('❌ No session ID found');
    } else {
        console.log('🔌 Creating socket connection...');

        window.socket = io('http://localhost:3000', {
            auth: {
                sessionId: sessionId,
                uid: window.currentUser.uid
            },
            transports: ['polling'],
            timeout: 20000
        });

        window.socket.on('connect', () => {
            console.log('✅ Socket connected successfully!');
            console.log('- Socket ID:', window.socket.id);

            // Set up delivery/read event handlers
            window.socket.on('messagesDelivered', (data) => {
                console.log('📨 MESSAGE DELIVERED!');
                console.log('   To:', data.recipientUid);
                console.log('   Messages:', data.messageIds?.length || 'unknown');

                // Update UI
                data.messageIds?.forEach(id => {
                    const msg = document.querySelector(`[data-message-id="${id}"]`);
                    if (msg) {
                        const status = msg.querySelector('.message-status');
                        if (status) {
                            status.outerHTML = '<span class="message-status delivered"><i class="fas fa-circle"></i><i class="fas fa-circle"></i></span>';
                            console.log(`   ✅ Updated message ${id} to delivered`);
                        }
                    }
                });
            });

            window.socket.on('messagesRead', (data) => {
                console.log('👁️ MESSAGE READ!');
                console.log('   By:', data.readerUid);
                console.log('   Messages:', data.messageIds?.length || 'unknown');

                // Update UI
                data.messageIds?.forEach(id => {
                    const msg = document.querySelector(`[data-message-id="${id}"]`);
                    if (msg) {
                        const status = msg.querySelector('.message-status');
                        if (status) {
                            status.outerHTML = '<span class="message-status read"><i class="fas fa-circle"></i><i class="fas fa-circle"></i></span>';
                            console.log(`   ✅ Updated message ${id} to read`);
                        }
                    }
                });
            });

            console.log('\n🎯 INITIALIZATION COMPLETE!');
            console.log('✅ currentUser:', window.currentUser);
            console.log('✅ socket connected:', window.socket.connected);
            console.log('\n🧪 READY FOR TESTING!');
            console.log('Try sending a message now.');
        });

        window.socket.on('connect_error', (error) => {
            console.log('❌ Socket connection error:', error);
            console.log('Check:');
            console.log('- Server running on port 3000');
            console.log('- Network connection');
            console.log('- Browser console for more errors');
        });
    }
}
