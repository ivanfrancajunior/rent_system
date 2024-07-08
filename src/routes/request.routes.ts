import { Router } from "express";
import { RequestController } from "../controllers/request.controllers";

const router = Router();

router.post("/new", RequestController.createRequest);

router.get("/", RequestController.getRequests);

router.get("/:id", RequestController.getUserRequests);

router.put("/:id", RequestController.updateRequests);

export default router;
