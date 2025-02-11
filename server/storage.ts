import { User, Password, InsertUser, InsertPassword, users, passwords } from "@shared/schema";
import session from "express-session";
import memorystore from "memorystore";
import { eq } from "drizzle-orm";
import { db } from "./db";

const MemoryStore = memorystore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser & { masterKey: string }): Promise<User>;
  updateUserPassword(userId: number, password: string): Promise<void>;
  createPassword(password: InsertPassword & { userId: number }): Promise<Password>;
  getPasswordById(id: number): Promise<Password | undefined>;
  getPasswordsByUserId(userId: number): Promise<Password[]>;
  deletePassword(id: number): Promise<void>;
  sessionStore: session.Store;
}

export class SQLiteStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = db.select().from(users).where(eq(users.id, id)).all();
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = db.select().from(users).where(eq(users.username, username)).all();
    return result[0];
  }

  async createUser(insertUser: InsertUser & { masterKey: string }): Promise<User> {
    const result = db.insert(users).values(insertUser).run();
    return {
      id: Number(result.lastInsertRowid),
      ...insertUser,
    };
  }

  async updateUserPassword(userId: number, newPassword: string): Promise<void> {
    await db.update(users)
      .set({ password: newPassword })
      .where(eq(users.id, userId))
      .run();
  }

  async createPassword(insertPassword: InsertPassword & { userId: number }): Promise<Password> {
    const result = db.insert(passwords).values(insertPassword).run();
    return {
      id: Number(result.lastInsertRowid),
      ...insertPassword,
    };
  }

  async getPasswordById(id: number): Promise<Password | undefined> {
    const result = db.select().from(passwords).where(eq(passwords.id, id)).all();
    return result[0];
  }

  async getPasswordsByUserId(userId: number): Promise<Password[]> {
    return db.select().from(passwords).where(eq(passwords.userId, userId)).all();
  }

  async deletePassword(id: number): Promise<void> {
    await db.delete(passwords).where(eq(passwords.id, id)).run();
  }
}

export const storage = new SQLiteStorage();