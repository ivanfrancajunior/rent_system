import { NextFunction, Request, Response } from "express";

import { Payment } from "../../models/Payment";

export const verifyPendences = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const req_user = req.user;

  const userPayments = await Payment.find({ userId: req_user?.id });

  const havePendences = userPayments.filter(
    (payment) => payment.status === "IS_OPEN"
  );

  if (havePendences) return res.status(403).json({ error: "Unauthorized" });

  next();
};
