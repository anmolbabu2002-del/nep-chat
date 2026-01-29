// Generate VAPID keys for Web Push
const webpush = require('web-push');

console.log('Generating VAPID keys...\n');

const vapidKeys = webpush.generateVAPIDKeys();

console.log('=== VAPID Keys Generated ===\n');
console.log('Public Key:');
console.log(vapidKeys.publicKey);
console.log('\nPrivate Key:');
console.log(vapidKeys.privateKey);
console.log('\n=== IMPORTANT ===');
console.log('Save these keys securely!');
console.log('Add them to your server.js or environment variables.');
console.log('The public key goes to the client-side code.');
