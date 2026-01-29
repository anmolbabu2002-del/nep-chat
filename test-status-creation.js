// TEST STATUS INDICATOR CREATION
console.log('🧪 TESTING STATUS INDICATOR CREATION');
console.log('=====================================');

// Test 1: Check if getStatusIcon function works
console.log('🎯 Testing getStatusIcon function:');
try {
    const sentIcon = getStatusIcon('sent');
    const deliveredIcon = getStatusIcon('delivered');
    const readIcon = getStatusIcon('read');

    console.log('Sent icon HTML:', sentIcon);
    console.log('Delivered icon HTML:', deliveredIcon);
    console.log('Read icon HTML:', readIcon);

    // Create test elements
    const testDiv = document.createElement('div');
    testDiv.innerHTML = sentIcon + deliveredIcon + readIcon;
    console.log('✅ Icons generated successfully');

    // Check if they contain the right elements
    const checkmarks = testDiv.querySelectorAll('.fa-check');
    console.log(`Total checkmarks created: ${checkmarks.length}`);

} catch (error) {
    console.log('❌ Error calling getStatusIcon:', error);
}

// Test 2: Create a test message manually
console.log('\n📨 Testing manual message creation:');
try {
    const testMessage = {
        id: 999999,
        senderUid: currentUser?.uid || 'test-user',
        text: 'Test message with status',
        status: 'sent',
        timestamp: new Date().toISOString()
    };

    console.log('Test message:', testMessage);

    // Test ownership
    const isOwn = testMessage.senderUid === currentUser?.uid;
    console.log('Is own message:', isOwn);

    // Test status icon generation
    const statusIcon = isOwn ? getStatusIcon(testMessage.status || 'sent') : '';
    console.log('Status icon for own message:', statusIcon);

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isOwn ? 'sent' : 'received'}`;
    messageDiv.setAttribute('data-message-id', testMessage.id);

    const time = new Date(testMessage.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${testMessage.text}</p>
            <div class="message-footer">
                <span class="message-time">${time}</span>
                ${statusIcon}
            </div>
        </div>
    `;

    // Add to messages container
    const messagesContainer = document.querySelector('.messages');
    if (messagesContainer) {
        messagesContainer.appendChild(messageDiv);
        console.log('✅ Test message added to chat');

        // Check if status is visible
        const statusEl = messageDiv.querySelector('.message-status');
        if (statusEl) {
            console.log('✅ Status element found in test message');
            const computedStyle = getComputedStyle(statusEl);
            console.log('Status visibility:', {
                display: computedStyle.display,
                visibility: computedStyle.visibility,
                opacity: computedStyle.opacity
            });
        } else {
            console.log('❌ Status element NOT found in test message');
        }
    } else {
        console.log('❌ Messages container not found');
    }

} catch (error) {
    console.log('❌ Error creating test message:', error);
}

// Test 3: Check current user setup
console.log('\n👤 Current User Check:');
console.log('currentUser object:', currentUser);
console.log('currentUser.uid:', currentUser?.uid);
console.log('currentUser.uid type:', typeof currentUser?.uid);

// Summary
console.log('\n🎯 SUMMARY:');
console.log('If test message shows status indicators but real messages don\'t:');
console.log('→ Issue is with message loading or ownership detection');
console.log('If test message also doesn\'t show status:');
console.log('→ Issue is with CSS styling or icon rendering');
console.log('If status icons are generated but not visible:');
console.log('→ Issue is with CSS display/visibility properties');
