import { Router } from "express";
import { UserController } from "../controllers/users.controller";

const router = Router();

router.post("/new", (req, res) => {
  return UserController.createUser(req, res);
});

router.get("/", (req, res) => {
  return UserController.getUsers(req, res);
});

router.get("/:id", (req, res) => {
  return UserController.getUser(req, res);
});

export default router;
