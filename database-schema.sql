-- PostgreSQL Schema for Chat App
-- Run this to set up your PostgreSQL database

-- Users table
CREATE TABLE IF NOT EXISTS users (
    uid TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    profile_pic TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Conversations table to track shared settings
CREATE TABLE IF NOT EXISTS conversations (
    chat_id TEXT PRIMARY KEY,
    theme TEXT DEFAULT 'default',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Messages table with status tracking
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    chat_id TEXT NOT NULL,
    sender_uid TEXT NOT NULL,
    text TEXT NOT NULL,
    type TEXT DEFAULT 'text' CHECK (type IN ('text', 'system', 'file', 'call')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read')),
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    file_url TEXT,
    file_name TEXT,
    file_size INTEGER,
    file_type TEXT,
    FOREIGN KEY (sender_uid) REFERENCES users (uid) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_uid ON messages(sender_uid);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);

-- User sessions table (for backward compatibility, though we now use Redis)
CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,
    uid TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES users (uid) ON DELETE CASCADE
);

-- Reactions table
CREATE TABLE IF NOT EXISTS reactions (
    id SERIAL PRIMARY KEY,
    message_id INTEGER NOT NULL,
    user_uid TEXT NOT NULL,
    emoji TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (user_uid) REFERENCES users(uid) ON DELETE CASCADE,
    UNIQUE(message_id, user_uid, emoji)
);

-- Create index for reactions
CREATE INDEX IF NOT EXISTS idx_reactions_message_id ON reactions(message_id);

-- Clean up old sessions (older than 24 hours) - run this periodically
-- DELETE FROM sessions WHERE created_at < NOW() - INTERVAL '24 hours';
