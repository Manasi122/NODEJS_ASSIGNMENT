import { Request, Response } from "express";

export const test = (req: Request, res: Response): void => {
  res.status(200).json("Test called successfully");
};
