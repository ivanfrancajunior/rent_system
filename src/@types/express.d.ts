import { Request } from "express";

import { UserTypes } from '../models/Users';

declare module "express" {
  interface Request {
    user?: UserTypes;
  }
}
