import { Request, Response } from "express";
import { InMemoryStore } from "../services/store.service";
const store = new InMemoryStore();

export const setKey = async (req: Request, res: Response): Promise<void> => {
  try {
    const { key, value, ttl } = req.body;

    if (!key || value === undefined) {
      res.status(400).json({ error: "Key and value are required." });
      return;
    }

    if (ttl && typeof ttl !== "number") {
      res.status(400).json({ error: "TTL must be a number." });
      return;
    }

    await store.set(key, value, ttl);
    res.status(201).json({ message: `Key '${key}' set successfully.` });
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to set key.", details: (error as Error).message });
  }
};

export const getKey = async (req: Request, res: Response): Promise<void> => {
  try {
    const key = req.params.key;
    const value = await store.get(key);

    if (value === undefined) {
      res.status(404).json({ error: `Key '${key}' not found.` });
      return;
    }

    res.json({ key, value });
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to retrieve key.", details: (error as Error).message });
  }
};

export const deleteKey = async (req: Request, res: Response): Promise<void> => {
  try {
    const key = req.params.key;
    const deleted = await store.delete(key);

    res.json({ message: `Key '${key}' deleted successfully.` });
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to delete key.", details: (error as Error).message });
  }
};

export const cleanupKeys = async (_req: Request, res: Response): Promise<void> => {
  try {
    const cleanedKeys = await store.cleanup();

    if (cleanedKeys.length === 0) {
      res.status(204).json({ message: "No expired keys found." });
      return;
    }

    res.json({ message: `Cleaned up ${cleanedKeys} expired keys.`, cleanedKeys });
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to clean up keys.", details: (error as Error).message });
  }
};
