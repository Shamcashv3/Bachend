const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'visitors.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS visitors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT,
    country TEXT,
    city TEXT,
    user_agent TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    language TEXT,
    screen_size TEXT,
    timezone TEXT,
    referrer TEXT,
    page TEXT,
    latitude REAL,
    longitude REAL,
    location_accuracy REAL,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

// يضيف الأعمدة الجديدة إن كانت قاعدة البيانات قديمة (أُنشئت قبل إضافة دعم GPS)
const existingColumns = db.prepare(`PRAGMA table_info(visitors)`).all().map(c => c.name);
for (const [col, type] of [['latitude', 'REAL'], ['longitude', 'REAL'], ['location_accuracy', 'REAL']]) {
  if (!existingColumns.includes(col)) {
    db.exec(`ALTER TABLE visitors ADD COLUMN ${col} ${type}`);
  }
}

module.exports = db;
