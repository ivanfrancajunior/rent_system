import { Request, Response, NextFunction } from "express";

export const verifyPermission = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) return res.status(401).json({ error: "Unauthorized" });

    if (!roles.includes(user?.role!)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.log(user.role);

    next();
  };
};
