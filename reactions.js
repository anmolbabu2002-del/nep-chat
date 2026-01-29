// Emoji picker configuration
const EMOJI_CATEGORIES = {
    smileys: ['😊', '😂', '🥰', '😍', '🤩', '😎', '🤗', '🤔', '😮', '😢', '😭', '🥺', '😡', '🤯', '😴', '🤮', '😇', '🥳', '🤪', '😜'],
    hearts: ['❤️', '💕', '💖', '💗', '💓', '💝', '💘', '💟', '💌', '💋', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '❣️', '💔'],
    gestures: ['👍', '👎', '👏', '🙌', '👋', '🤝', '🙏', '✌️', '🤞', '🤟', '🤘', '👌', '👈', '👉', '👆', '👇', '✊', '👊', '🤛', '🤜'],
    objects: ['⚡', '🔥', '⭐', '✨', '💥', '💯', '🎉', '🎊', '🎁', '🏆', '🥇', '💎', '👑', '🌈', '☀️', '🌙', '⚽', '🎮', '💰', '🎯']
};

let currentMessageIdForReaction = null;
const messageReactions = new Map(); // messageId -> {emoji: count}

// Initialize emoji picker
function initEmojiPicker() {
    console.log('🏁 Initializing Emoji Picker...');
    // Create emoji picker modal if it doesn't exist
    if (!document.getElementById('emojiPickerModal')) {
        const modal = document.createElement('div');
        modal.id = 'emojiPickerModal';
        modal.className = 'emoji-modal hidden';
        modal.innerHTML = `
            <div class="emoji-modal-content">
                <div class="emoji-modal-header">
                    <h3>Choose Reaction</h3>
                    <button onclick="closeEmojiPicker()" class="emoji-close-btn">&times;</button>
                </div>
                <div class="emoji-categories">
                    <button class="emoji-category-btn active" onclick="switchEmojiCategory('smileys')">😊 Smileys</button>
                    <button class="emoji-category-btn" onclick="switchEmojiCategory('hearts')">❤️ Hearts</button>
                    <button class="emoji-category-btn" onclick="switchEmojiCategory('gestures')">👍 Gestures</button>
                    <button class="emoji-category-btn" onclick="switchEmojiCategory('objects')">⚡ Objects</button>
                </div>
                <div class="emoji-grid" id="emojiGrid"></div>
            </div>
        `;
        document.body.appendChild(modal);

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeEmojiPicker();
        });
    }

    switchEmojiCategory('smileys');
}

function switchEmojiCategory(category) {
    const grid = document.getElementById('emojiGrid');
    grid.innerHTML = '';

    EMOJI_CATEGORIES[category].forEach(emoji => {
        const item = document.createElement('div');
        item.className = 'emoji-item';
        item.textContent = emoji;
        item.onclick = () => selectEmojiFromPicker(emoji);
        grid.appendChild(item);
    });

    // Update active category button
    document.querySelectorAll('.emoji-category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick')?.includes(`'${category}'`)) {
            btn.classList.add('active');
        }
    });
}

function openEmojiPicker(messageId) {
    currentMessageIdForReaction = messageId;
    document.getElementById('emojiPickerModal').classList.remove('hidden');
}

function closeEmojiPicker() {
    document.getElementById('emojiPickerModal').classList.add('hidden');
    currentMessageIdForReaction = null;
}

function selectEmojiFromPicker(emoji) {
    if (currentMessageIdForReaction) {
        addReactionToMessage(currentMessageIdForReaction, emoji);
    }
    closeEmojiPicker();
}

function addReactionToMessage(messageId, emoji) {
    console.log(`📤 Sending reaction ${emoji} for message ${messageId} to target ${targetUid}`);
    socket.emit('addReaction', { messageId, emoji, targetUid });
}

function updateReactionDisplay(messageId, reactions) {
    const messageEl = document.querySelector(`[data-message-id="${messageId}"]`);
    if (!messageEl) return;

    let reactionDisplay = messageEl.querySelector('.reaction-display');
    if (!reactionDisplay) {
        reactionDisplay = document.createElement('div');
        reactionDisplay.className = 'reaction-display';
        // Find the bubble div (it's the first child with group class usually)
        const bubble = messageEl.querySelector('.relative.group');
        if (bubble) bubble.appendChild(reactionDisplay);
    }

    // Group reactions by emoji
    const grouped = {};
    reactions.forEach(r => {
        if (!grouped[r.emoji]) grouped[r.emoji] = [];
        grouped[r.emoji].push(r.user_uid);
    });

    // Clear and rebuild
    reactionDisplay.innerHTML = '';
    Object.entries(grouped).forEach(([emoji, users]) => {
        const badge = document.createElement('div');
        badge.className = 'reaction-badge';
        if (users.includes(currentUser.uid)) badge.classList.add('my-reaction');
        badge.innerHTML = `<span>${emoji}</span><span class="reaction-count">${users.length}</span>`;
        badge.onclick = () => addReactionToMessage(messageId, emoji);
        reactionDisplay.appendChild(badge);
    });
}

// Socket.io reaction handlers
socket.on('reactionUpdated', (data) => {
    console.log('📥 Reaction update received:', data);
    // Fetch latest reactions for this message
    socket.emit('getReactions', { messageIds: [data.messageId] }, (reactions) => {
        updateReactionDisplay(data.messageId, reactions.filter(r => r.message_id == data.messageId));
    });
});

// Initialize on load
initEmojiPicker();
