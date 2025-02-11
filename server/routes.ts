import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertPasswordSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Password management routes
  app.post("/api/passwords", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const parsedData = insertPasswordSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json(parsedData.error);
    }

    try {
      const password = await storage.createPassword({
        ...parsedData.data,
        userId: req.user.id
      });
      res.status(201).json(password);
    } catch (error) {
      console.error('Error creating password:', error);
      res.status(500).json({ message: "Failed to create password" });
    }
  });

  app.get("/api/passwords", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const passwords = await storage.getPasswordsByUserId(req.user.id);
      res.json(passwords);
    } catch (error) {
      console.error('Error fetching passwords:', error);
      res.status(500).json({ message: "Failed to fetch passwords" });
    }
  });

  app.delete("/api/passwords/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const password = await storage.getPasswordById(Number(req.params.id));

      if (!password) {
        return res.status(404).json({ message: "Password not found" });
      }

      if (password.userId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      await storage.deletePassword(Number(req.params.id));
      res.sendStatus(200);
    } catch (error) {
      console.error('Error deleting password:', error);
      res.status(500).json({ message: "Failed to delete password" });
    }
  });

  // Update user password
  app.post("/api/user/password", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      await storage.updateUserPassword(req.user.id, req.body.password);
      res.sendStatus(200);
    } catch (error) {
      console.error('Error updating user password:', error);
      res.status(500).json({ message: "Failed to update password" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}