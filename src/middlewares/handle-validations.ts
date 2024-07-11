import { Request, Response, NextFunction } from "express";
import { ValidationError, validationResult } from "express-validator";

export const handleValidate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErros: ValidationError[] = [];

    errors.array().map((err) => extractedErros.push(err.msg));

    return res.status(400).json({ errors: extractedErros });
  }

  return next();
};
