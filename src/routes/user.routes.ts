import { Router } from "express";
import { UserController } from "../controllers/users.controller";
import { handleAuth } from "../middlewares/auth-handler";
import { verifyPermission } from "../middlewares/users/verify-permission";
import {
  validateCreateUser,
  validateSigninUser,
  validateUpdateUser,
} from "../middlewares/users/user-validations";
import { handleValidate } from "../middlewares/handle-validations";

const router = Router();

router.post(
  "/new",
  validateCreateUser(),
  handleValidate,
  UserController.createUser
);

router.post(
  "/login",
  validateSigninUser(),
  handleValidate,
  UserController.loginUser
);

router.get("/", handleAuth, UserController.getUsers);

router.get("/:id", handleAuth, UserController.getUser);

router.put(
  "/:id",
  handleAuth,
  verifyPermission(["ADMIN"]),
  validateUpdateUser(),
  handleValidate,
  UserController.updateUserProfile
);

export default router;
