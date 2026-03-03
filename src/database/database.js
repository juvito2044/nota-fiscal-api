const sqlite3 = require("sqlite3").verbose()

const db = new sqlite3.Database("./database.sqlite")

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS ceps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cep TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `)
})

module.exports = db