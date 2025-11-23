const Database = require('better-sqlite3');
const path = require('path');
const dbPath = process.env.DB_FILE || path.join(__dirname,'data.sqlite');
const db = new Database(dbPath);

// Run migrations if tables not exist
const initSql = `
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  unit TEXT NOT NULL,
  category TEXT NOT NULL,
  brand TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'In Stock',
  image TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  productId INTEGER NOT NULL,
  oldStock INTEGER NOT NULL,
  newStock INTEGER NOT NULL,
  changedBy TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(productId) REFERENCES products(id)
);
`;
db.exec(initSql);

module.exports = db;
