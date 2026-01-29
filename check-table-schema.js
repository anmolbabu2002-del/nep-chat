// Check Table Schema
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'chatapp.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        return;
    }
    console.log('Connected to SQLite database');
});

// Check messages table schema
console.log('\n📋 MESSAGES TABLE SCHEMA:');
db.all("PRAGMA table_info(messages)", [], (err, columns) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('Columns:');
        columns.forEach(col => {
            console.log(`  ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
        });

        // Check if file columns exist
        const hasFileUrl = columns.some(col => col.name === 'file_url');
        const hasFileName = columns.some(col => col.name === 'file_name');
        const hasFileSize = columns.some(col => col.name === 'file_size');
        const hasFileType = columns.some(col => col.name === 'file_type');

        console.log('\n🔍 FILE COLUMN STATUS:');
        console.log(`file_url: ${hasFileUrl ? '✅ EXISTS' : '❌ MISSING'}`);
        console.log(`file_name: ${hasFileName ? '✅ EXISTS' : '❌ MISSING'}`);
        console.log(`file_size: ${hasFileSize ? '✅ EXISTS' : '❌ MISSING'}`);
        console.log(`file_type: ${hasFileType ? '✅ EXISTS' : '❌ MISSING'}`);

        if (!hasFileUrl || !hasFileName || !hasFileSize || !hasFileType) {
            console.log('\n⚠️ File columns missing - ALTER TABLE may not have run yet');
            console.log('Restarting server should fix this...');
        } else {
            console.log('\n✅ All file columns present - ready for file uploads!');
        }
    }

    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        }
    });
});
