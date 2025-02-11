import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "@shared/schema";

const sqlite = new Database('sqlite.db');

// Initialize the database with our schema
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    masterKey TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS passwords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    website TEXT,
    username TEXT,
    encrypted_password TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    tags TEXT DEFAULT '[]'
  );
`);

export const db = drizzle(sqlite, { schema });