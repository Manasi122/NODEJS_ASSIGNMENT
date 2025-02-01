import express from "express";
import { setKey, getKey, deleteKey, cleanupKeys } from "../controllers/store.controller";

const router = express.Router();

router.post("/set", setKey);
router.get("/get/:key", getKey);
router.delete("/delete/:key", deleteKey);
router.post("/cleanup", cleanupKeys);

export default router;
