import express from "express";
import { test } from "../controllers/test.controller";
import { rateLimiter } from "../middlewares/rateLimiter";

const router = express.Router();

router.get("/rateLimiter", rateLimiter, test);

export default router;
