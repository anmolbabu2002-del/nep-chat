// Test message delivery speed and live chatting performance
// Run this in browser console

console.log('⚡ TESTING MESSAGE DELIVERY SPEED');
console.log('=================================');

// Test 1: Socket.IO connection speed
console.log('🔌 Connection Test:');
if (window.socket) {
    const connected = window.socket.connected;
    const transport = window.socket.io?.engine?.transport?.name;
    console.log(`  Connected: ${connected}`);
    console.log(`  Transport: ${transport}`);
    console.log(`  Ping: Testing...`);

    // Test ping
    const start = Date.now();
    window.socket.emit('ping', { timestamp: start });
    window.socket.once('pong', (data) => {
        const ping = Date.now() - start;
        console.log(`  Ping: ${ping}ms`);
        console.log(`  Speed: ${ping < 100 ? 'EXCELLENT' : ping < 500 ? 'GOOD' : 'SLOW'}`);
    });
} else {
    console.log('  ❌ No socket connection');
}

// Test 2: Message sending speed
console.log('\n📤 Message Speed Test:');
let messageCount = 0;
let totalTime = 0;

function sendTestMessage() {
    if (!window.socket || !window.currentUser) {
        console.log('❌ Cannot send test message - not connected');
        return;
    }

    messageCount++;
    const startTime = Date.now();
    const testText = `Speed test message ${messageCount} - ${new Date().toLocaleTimeString()}`;

    console.log(`Sending test message ${messageCount}...`);

    // Listen for message sent confirmation
    const sentHandler = (message) => {
        if (message.text === testText) {
            const sendTime = Date.now() - startTime;
            totalTime += sendTime;
            const avgTime = totalTime / messageCount;

            console.log(`✅ Message ${messageCount} sent in ${sendTime}ms (avg: ${avgTime.toFixed(1)}ms)`);

            window.socket.off('messageSent', sentHandler);

            if (messageCount < 3) {
                setTimeout(sendTestMessage, 1000); // Send another test message
            } else {
                console.log(`\n📊 RESULTS:`);
                console.log(`  Average send time: ${avgTime.toFixed(1)}ms`);
                console.log(`  Performance: ${avgTime < 200 ? 'EXCELLENT' : avgTime < 1000 ? 'GOOD' : 'NEEDS IMPROVEMENT'}`);
                console.log(`  Live chatting: ${avgTime < 500 ? 'SUPPORTED' : 'MAY HAVE DELAYS'}`);
            }
        }
    };

    window.socket.on('messageSent', sentHandler);

    // Send the message
    window.socket.emit('sendMessage', {
        targetUid: 'test_recipient',
        text: testText
    });

    // Timeout after 5 seconds
    setTimeout(() => {
        window.socket.off('messageSent', sentHandler);
        if (messageCount <= 3) {
            console.log(`❌ Message ${messageCount} timeout after 5s`);
        }
    }, 5000);
}

// Test 3: Real-time delivery test
console.log('\n🎯 Real-time Delivery Test:');
console.log('To test live chatting between devices:');
console.log('1. Open this chat in two browser windows/tabs');
console.log('2. Send messages from one window');
console.log('3. Check how quickly they appear in the other window');
console.log('4. Messages should appear in < 1 second');

// Start the speed test
console.log('\n🚀 Starting speed test...');
setTimeout(() => {
    sendTestMessage();
}, 1000);

// Expected results
console.log('\n🎯 EXPECTED PERFORMANCE:');
console.log('• Send time: < 200ms (excellent)');
console.log('• Real-time delivery: < 1 second');
console.log('• Live chatting: Fully supported');
console.log('• Transport: Polling (reliable but slower than WebSocket)');
