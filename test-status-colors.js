// Test status indicator colors
// Run this in browser console to see current status colors

console.log('🎨 TESTING STATUS INDICATOR COLORS');
console.log('==================================');

// Find all message status elements
const statusElements = document.querySelectorAll('.message-status');
console.log(`Found ${statusElements.length} status indicators`);

statusElements.forEach((status, index) => {
    const classes = status.className;
    const color = window.getComputedStyle(status).color;
    const background = window.getComputedStyle(status).background;
    const textShadow = window.getComputedStyle(status).textShadow;

    console.log(`\nStatus ${index + 1}:`);
    console.log(`  Classes: ${classes}`);
    console.log(`  Color: ${color}`);
    console.log(`  Background: ${background}`);
    console.log(`  Text Shadow: ${textShadow}`);

    // Check what status it represents
    if (classes.includes('read')) {
        console.log(`  📖 STATUS: READ (should be bright yellow/gold)`);
        if (color.includes('255, 237, 78') || color.includes('ffed4e')) {
            console.log(`  ✅ CORRECT: Bright yellow color detected`);
        } else {
            console.log(`  ❌ WRONG: Expected bright yellow, got ${color}`);
        }
    } else if (classes.includes('delivered')) {
        console.log(`  📬 STATUS: DELIVERED (should be dark golden)`);
        if (color.includes('184, 134, 11') || color.includes('b8860b')) {
            console.log(`  ✅ CORRECT: Dark golden color detected`);
        } else {
            console.log(`  ❌ WRONG: Expected dark golden, got ${color}`);
        }
    } else if (classes.includes('sent')) {
        console.log(`  📤 STATUS: SENT (should be golden yellow)`);
        if (color.includes('212, 175, 55') || color.includes('d4af37')) {
            console.log(`  ✅ CORRECT: Golden yellow color detected`);
        } else {
            console.log(`  ❌ WRONG: Expected golden yellow, got ${color}`);
        }
    }
});

// Summary
console.log('\n📊 SUMMARY:');
const sentCount = document.querySelectorAll('.message-status.sent').length;
const deliveredCount = document.querySelectorAll('.message-status.delivered').length;
const readCount = document.querySelectorAll('.message-status.read').length;

console.log(`  Sent: ${sentCount} (golden yellow ○)`);
console.log(`  Delivered: ${deliveredCount} (dark golden ○○)`);
console.log(`  Read: ${readCount} (bright yellow ○○ with glow)`);

console.log('\n🎯 EXPECTED COLORS:');
console.log('  • Golden yellow: rgb(212, 175, 55) or #d4af37');
console.log('  • Dark golden: rgb(184, 134, 11) or #b8860b');
console.log('  • Bright yellow: rgb(255, 237, 78) or #ffed4e');

console.log('\n💡 If colors are wrong, try hard refresh (Ctrl+F5)');
