import { Request, Response, NextFunction } from "express";

const WINDOW_SIZE_IN_SECONDS = 60; 
const MAX_WINDOW_REQUEST_COUNT = 10; 

const ipRequestMap: Map<string, number[]> = new Map();

export const rateLimiter = (req: Request, res: Response, next: NextFunction): void => {
  const ip = req.ip!;
  const currentTime = Date.now();
  const windowStartTimestamp = currentTime - WINDOW_SIZE_IN_SECONDS * 1000;

  const requestTimestamps = ipRequestMap.get(ip) || [];
  const updatedTimestamps = requestTimestamps.filter(timestamp => timestamp > windowStartTimestamp);

  if (updatedTimestamps.length >= MAX_WINDOW_REQUEST_COUNT) {
    res.status(429).json({ error: `Rate limit exceeded. Max ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_SECONDS} seconds.` });
    return;
  }

  updatedTimestamps.push(currentTime);
  ipRequestMap.set(ip, updatedTimestamps);

  next();
};
