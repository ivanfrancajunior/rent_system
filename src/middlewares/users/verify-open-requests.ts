import { NextFunction, Request, Response } from "express";

import { Request as Req } from "../../models/Requests";

export const verifyOpenRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const req_user = req.user;

  const userRequests = await Req.find({ userId: req_user?.id });

  const havePendences = userRequests.filter(
    (req) => req.status === "COMPLETED" || "CANCELLED"
  );

  if (havePendences) return res.status(403).json({ error: "Requests can only be opened without another one being open" });

  next();
};
