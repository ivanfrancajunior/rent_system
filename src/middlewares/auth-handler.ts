import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/User";
const JWT_SECRET = process.env.JWT_SECRET!;

export const handleAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  const bearer = authHeader && authHeader.split(" ")[1];

  if (!bearer) {
    return res.status(401).json({ errors: ["Not authorized"] });
  }

  try {
    const decodedToken = jwt.verify(bearer, JWT_SECRET) as JwtPayload;

    const user = await User.findById(decodedToken.id);

    if (!user) return res.status(401).json({ error: "Not authorized" });

    req.user = user.toObject();

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
