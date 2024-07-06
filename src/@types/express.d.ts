import { Request } from "express";
import multer from "multer";
import { UserTypes } from "../models/User";

declare module "express" {
  interface Request {
    user?: UserTypes;
    file?: Express.Multer.File;
  }
}
