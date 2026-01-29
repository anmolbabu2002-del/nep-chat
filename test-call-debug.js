/**
 * Socket Call Test - Run in browser console
 * 
 * This script will help debug socket connectivity issues
 */

console.log('=== SOCKET CALL TEST ===');

// Test 1: Check if socket exists and is connected
console.log('1. Socket exists:', !!socket);
console.log('2. Socket connected:', socket?.connected);
console.log('3. Socket ID:', socket?.id);
console.log('4. Current user:', currentUser);
console.log('5. Target user:', targetUser);

// Test 2: Check if call handlers are set up
console.log('6. Call buttons exist:', {
    video: !!document.getElementById('videoCallBtn'),
    audio: !!document.getElementById('audioCallBtn')
});

// Test 3: Manually test socket emission (as User A)
console.log('\n=== MANUAL TEST: Emitting callUser ===');
console.log('Run this in User A browser:');
console.log(`
socket.emit("callUser", {
    userToCall: targetUser.uid,
    from: currentUser.uid,
    name: currentUser.name,
    channelName: "test_channel",
    type: "video"
});
console.log('Call signal sent!');
`);

// Test 4: Listen for incoming calls (as User B)
console.log('\n=== MANUAL TEST: Listen for calls ===');
console.log('Run this in User B browser:');
console.log(`
socket.on("callUser", (data) => {
    console.log('📞 RECEIVED CALL:', data);
    alert('Incoming call from: ' + data.name);
});
console.log('Now listening for calls...');
`);

// Test 5: Check socketrooms
console.log('\n=== ROOM CHECK ===');
console.log('To check if user is in their room, run on server:');
console.log('io.sockets.adapter.rooms');
