import db from "./database.js";

db.prepare(`
  CREATE TABLE IF NOT EXISTS trainings (
    id TEXT PRIMARY KEY,
    goal TEXT NOT NULL,
    days_per_week INTEGER NOT NULL,
    training_split TEXT NOT NULL,
    experience_level TEXT NOT NULL,
    equipment TEXT NOT NULL,
    status TEXT NOT NULL,
    training_json TEXT,
    created_at TEXT NOT NULL,
    retry_count INTEGER NOT NULL DEFAULT 0
  )
`).run();
