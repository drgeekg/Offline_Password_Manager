import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  masterKey: text('masterKey').notNull()
});

export const passwords = sqliteTable('passwords', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull(),
  name: text('name').notNull(),
  website: text('website'),
  username: text('username'),
  encryptedPassword: text('encrypted_password').notNull(),
  category: text('category').default('general'),
  tags: text('tags').default('[]') // Store as JSON string
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});

export const insertPasswordSchema = createInsertSchema(passwords).pick({
  name: true,
  website: true,
  username: true,
  encryptedPassword: true,
  category: true,
  tags: true
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Password = typeof passwords.$inferSelect;
export type InsertPassword = z.infer<typeof insertPasswordSchema>;