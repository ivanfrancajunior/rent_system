import { Router } from "express";
import { RequestController } from "../controllers/request.controllers";
import { handleAuth } from "../middlewares/auth-handler";
import { verifyPermission } from "../middlewares/users/verify-permission";

import {
  validateCreateRequest,
  validateUpdateRequest,
} from "../middlewares/requests/request-validations";

import { handleValidate } from "../middlewares/handle-validations";

const router = Router();

router.post(
  "/new",
  handleAuth,
  validateCreateRequest(),
  handleValidate,
  RequestController.createRequest
);

router.get("/", handleAuth, RequestController.getRequests);

router.get("/:id", handleAuth, RequestController.getUserRequests);

router.put(
  "/:id",
  handleAuth,
  verifyPermission(["ADMIN", "EMPLOYEE"]),
  validateUpdateRequest(),
  handleValidate,
  RequestController.updateRequests
);

export default router;
