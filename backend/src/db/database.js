import Database from "better-sqlite3";

const dbPath = process.env.DB_PATH || "trainia.db";
const db = new Database(dbPath);

export default db;
