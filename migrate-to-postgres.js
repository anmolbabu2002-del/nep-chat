#!/usr/bin/env node

/**
 * Migration script to move data from SQLite to PostgreSQL
 * Run this after setting up PostgreSQL and updating your DATABASE_URL
 */

const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

// Configuration
const SQLITE_DB_PATH = path.join(__dirname, 'chatapp.db');
const POSTGRES_URL = process.env.DATABASE_URL || 'postgresql://localhost:5432/chatapp';

console.log('🚀 Starting SQLite to PostgreSQL migration...');
console.log(`📄 SQLite source: ${SQLITE_DB_PATH}`);
console.log(`🗄️  PostgreSQL target: ${POSTGRES_URL}`);

// Connect to databases
const sqliteDb = new sqlite3.Database(SQLITE_DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error opening SQLite database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database');
});

const pgPool = new Pool({
  connectionString: POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pgPool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to PostgreSQL:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to PostgreSQL database');
  release();
});

// Migration functions
async function migrateUsers() {
  console.log('\n👥 Migrating users...');

  return new Promise((resolve, reject) => {
    sqliteDb.all('SELECT * FROM users', async (err, rows) => {
      if (err) {
        console.error('❌ Error reading users from SQLite:', err);
        reject(err);
        return;
      }

      if (rows.length === 0) {
        console.log('ℹ️  No users to migrate');
        resolve();
        return;
      }

      console.log(`📊 Found ${rows.length} users to migrate`);

      try {
        for (const user of rows) {
          await pgPool.query(
            'INSERT INTO users (uid, name, username, password_hash, created_at) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (uid) DO NOTHING',
            [user.uid, user.name, user.username, user.password_hash, user.created_at]
          );
        }
        console.log('✅ Users migration completed');
        resolve();
      } catch (err) {
        console.error('❌ Error migrating users:', err);
        reject(err);
      }
    });
  });
}

async function migrateMessages() {
  console.log('\n💬 Migrating messages...');

  return new Promise((resolve, reject) => {
    sqliteDb.all('SELECT * FROM messages ORDER BY id', async (err, rows) => {
      if (err) {
        console.error('❌ Error reading messages from SQLite:', err);
        reject(err);
        return;
      }

      if (rows.length === 0) {
        console.log('ℹ️  No messages to migrate');
        resolve();
        return;
      }

      console.log(`📊 Found ${rows.length} messages to migrate`);

      try {
        for (const message of rows) {
          await pgPool.query(
            `INSERT INTO messages
             (id, chat_id, sender_uid, text, timestamp, status, delivered_at, read_at, file_url, file_name, file_size, file_type)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
             ON CONFLICT (id) DO NOTHING`,
            [
              message.id,
              message.chat_id,
              message.sender_uid,
              message.text,
              message.timestamp,
              message.status || 'sent',
              message.delivered_at,
              message.read_at,
              message.file_url,
              message.file_name,
              message.file_size,
              message.file_type
            ]
          );
        }
        console.log('✅ Messages migration completed');
        resolve();
      } catch (err) {
        console.error('❌ Error migrating messages:', err);
        reject(err);
      }
    });
  });
}

async function migrateSessions() {
  console.log('\n🔐 Migrating sessions...');

  return new Promise((resolve, reject) => {
    sqliteDb.all('SELECT * FROM sessions', async (err, rows) => {
      if (err) {
        console.error('❌ Error reading sessions from SQLite:', err);
        reject(err);
        return;
      }

      if (rows.length === 0) {
        console.log('ℹ️  No sessions to migrate');
        resolve();
        return;
      }

      console.log(`📊 Found ${rows.length} sessions to migrate`);

      try {
        for (const session of rows) {
          await pgPool.query(
            'INSERT INTO sessions (session_id, uid, created_at) VALUES ($1, $2, $3) ON CONFLICT (session_id) DO NOTHING',
            [session.session_id, session.uid, session.created_at]
          );
        }
        console.log('✅ Sessions migration completed');
        resolve();
      } catch (err) {
        console.error('❌ Error migrating sessions:', err);
        reject(err);
      }
    });
  });
}

async function runMigration() {
  try {
    await migrateUsers();
    await migrateMessages();
    await migrateSessions();

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update your server.js to use PostgreSQL (see code comments)');
    console.log('2. Set DATABASE_URL environment variable');
    console.log('3. Test your application');
    console.log('4. Optionally, backup and remove the SQLite file');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    sqliteDb.close();
    pgPool.end();
  }
}

// Run the migration
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };
