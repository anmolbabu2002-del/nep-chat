// Manual initialization fix for chat page
// Run this if currentUser and socket are not loading

console.log('🔧 MANUAL INITIALIZATION FIX');
console.log('=============================');

// 1. Check URL parameters
const urlParams = new URLSearchParams(window.location.search);
const uid = urlParams.get('uid');
const name = urlParams.get('name');
const username = urlParams.get('username');

console.log('📋 URL Parameters:');
console.log('- uid:', uid);
console.log('- name:', name);
console.log('- username:', username);

// 2. Set currentUser manually
if (uid && name) {
    window.currentUser = {
        uid: uid,
        name: decodeURIComponent(name),
        username: username || 'unknown'
    };
    console.log('✅ Set currentUser:', window.currentUser);
} else {
    console.log('❌ Missing URL parameters - cannot set currentUser');
    return;
}

// 3. Get session ID
const sessionId = localStorage.getItem('user_sessionId');
console.log('🔐 Session ID:', sessionId ? 'Found' : 'Missing');

// 4. Manual socket initialization
async function initSocketManually() {
    try {
        if (typeof io === 'undefined') {
            console.log('❌ Socket.IO not loaded');
            return false;
        }

        console.log('🔌 Creating socket connection...');

        window.socket = io('http://localhost:3000', {
            auth: {
                sessionId: sessionId,
                uid: window.currentUser.uid
            },
            transports: ['polling'],
            timeout: 20000,
            forceNew: false,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        return new Promise((resolve) => {
            window.socket.on('connect', () => {
                console.log('✅ Socket connected manually!');
                console.log('- Socket ID:', window.socket.id);

                // Set up basic event handlers
                setupBasicEventHandlers();

                resolve(true);
            });

            window.socket.on('connect_error', (error) => {
                console.log('❌ Socket connection failed:', error);
                resolve(false);
            });

            // Timeout after 10 seconds
            setTimeout(() => {
                if (!window.socket.connected) {
                    console.log('⏰ Socket connection timeout');
                    resolve(false);
                }
            }, 10000);
        });

    } catch (error) {
        console.log('❌ Socket init error:', error);
        return false;
    }
}

function setupBasicEventHandlers() {
    if (!window.socket) return;

    // Handle incoming messages
    window.socket.on('receiveMessage', (message) => {
        console.log('📨 Received message:', message);
        if (window.displayMessage) {
            window.displayMessage(message);
        }
    });

    // Handle delivery confirmations
    window.socket.on('messagesDelivered', (data) => {
        console.log('📨 Messages delivered:', data);
        // Update UI
        data.messageIds?.forEach(id => {
            const msg = document.querySelector(`[data-message-id="${id}"]`);
            if (msg) {
                const status = msg.querySelector('.message-status');
                if (status) {
                    status.outerHTML = '<span class="message-status delivered"><i class="fas fa-circle"></i><i class="fas fa-circle"></i></span>';
                }
            }
        });
    });

    // Handle read confirmations
    window.socket.on('messagesRead', (data) => {
        console.log('👁️ Messages read:', data);
        // Update UI
        data.messageIds?.forEach(id => {
            const msg = document.querySelector(`[data-message-id="${id}"]`);
            if (msg) {
                const status = msg.querySelector('.message-status');
                if (status) {
                    status.outerHTML = '<span class="message-status read"><i class="fas fa-circle"></i><i class="fas fa-circle"></i></span>';
                }
            }
        });
    });

    console.log('✅ Basic event handlers set up');
}

// 5. Initialize everything
async function manualInit() {
    const socketConnected = await initSocketManually();

    if (socketConnected) {
        console.log('\n🎉 MANUAL INITIALIZATION SUCCESSFUL!');
        console.log('✅ currentUser:', window.currentUser);
        console.log('✅ socket:', window.socket);
        console.log('✅ connected:', window.socket.connected);

        // Try to join chat if target user exists
        if (window.targetUser) {
            console.log('🔄 Joining chat with:', window.targetUser.name);
            window.socket.emit('joinChat', { targetUid: window.targetUser.uid });
        }

        console.log('\n🧪 READY FOR TESTING!');
        console.log('Try sending a message now.');
    } else {
        console.log('\n❌ MANUAL INITIALIZATION FAILED');
        console.log('Check:');
        console.log('- Server running on port 3000');
        console.log('- Network connection');
        console.log('- Browser console for errors');
    }
}

// Run the manual initialization
manualInit();
