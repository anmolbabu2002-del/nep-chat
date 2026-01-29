// Force refresh all status indicators to use new circle icons
// Run this in browser console

console.log('🔄 FORCE REFRESHING ALL STATUS INDICATORS');

function getStatusIcon(status) {
    switch (status) {
        case 'sent':
            return `<span class="message-status sent" title="Sent ○">
                <i class="fas fa-circle"></i>
            </span>`;
        case 'delivered':
            return `<span class="message-status delivered" title="Delivered ○○">
                <i class="fas fa-circle"></i><i class="fas fa-circle"></i>
            </span>`;
        case 'read':
            return `<span class="message-status read" title="Read ○○">
                <i class="fas fa-circle"></i><i class="fas fa-circle"></i>
            </span>`;
        default:
            return `<span class="message-status sent" title="Sent ○">
                <i class="fas fa-circle"></i>
            </span>`;
    }
}

// Find all sent messages
const sentMessages = document.querySelectorAll('.message.sent');
console.log(`Found ${sentMessages.length} sent messages`);

sentMessages.forEach((message, index) => {
    const statusElement = message.querySelector('.message-status');
    if (statusElement) {
        // Get current status
        let currentStatus = 'sent';
        if (statusElement.classList.contains('read')) {
            currentStatus = 'read';
        } else if (statusElement.classList.contains('delivered')) {
            currentStatus = 'delivered';
        }

        console.log(`Message ${index + 1}: Current status = ${currentStatus}`);
        console.log(`Current HTML: ${statusElement.outerHTML}`);

        // Replace with new circle icon
        statusElement.outerHTML = getStatusIcon(currentStatus);
        console.log(`✅ Updated to: ${getStatusIcon(currentStatus)}`);
    } else {
        console.log(`❌ No status element found for message ${index + 1}`);
    }
});

// Also refresh CSS by adding timestamp
const cssLink = document.querySelector('link[href="styles.css"]');
if (cssLink) {
    cssLink.href = 'styles.css?v=' + Date.now();
    console.log('🔄 Refreshed CSS cache');
}

// Check FontAwesome is loaded
const faLoaded = document.querySelector('link[href*="font-awesome"]') || document.querySelector('link[href*="fontawesome"]');
if (faLoaded) {
    console.log('✅ FontAwesome is loaded');
} else {
    console.log('❌ FontAwesome NOT loaded - adding it...');
    const faLink = document.createElement('link');
    faLink.rel = 'stylesheet';
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(faLink);
}

console.log('🎯 REFRESH COMPLETE - All status indicators should now show circles!');
