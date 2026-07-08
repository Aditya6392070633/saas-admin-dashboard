/**
 * Lightweight JSON-file data layer.
 *
 * This exists so the whole demo runs instantly with zero external database
 * setup. In production, replace the functions below with real queries
 * against PostgreSQL (e.g. using `pg` or an ORM like Prisma/Sequelize) —
 * every function here maps 1:1 to a SQL operation, so the swap is
 * straightforward. See README.md "Moving to PostgreSQL" section.
 */
const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "data", "db.json");

function ensureDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initial = { users: [], customers: [], subscriptions: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
  }
}

function readDB() {
  ensureDB();
  const raw = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

module.exports = { readDB, writeDB, ensureDB };
