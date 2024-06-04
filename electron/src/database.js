const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// Database file path
const dbPath = path.join(__dirname, "data", "database.sqlite");

// Function to create tables
const createTables = (db) => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT,
        value TEXT
      )
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS chats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        end_time DATETIME,
        title TEXT
      )
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chat_id INTEGER,
        sender TEXT,
        content TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(chat_id) REFERENCES chats(id)
      )
    `);
  });
};

// Initialize the database
const initializeDatabase = () => {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("Error opening database:", err);
    } else {
      console.log("Database opened successfully");
      createTables(db);
    }
  });
  return db;
};

// Check if the database file exists and initialize it if necessary
if (!fs.existsSync(dbPath)) {
  console.log("Database file does not exist, initializing...");
  initializeDatabase();
} else {
  console.log("Database file exists, opening...");
}

// Export the database connection
const db = new sqlite3.Database(dbPath);
module.exports = db;
