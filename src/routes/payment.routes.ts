import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { upload } from "../middlewares/handle-upload";
import { handleAuth } from "../middlewares/auth-handler";
import { verifyPermission } from "../middlewares/users/verify-permission";

const router = Router();

router.get(
  "/",
  handleAuth,
  verifyPermission(["ADNIN"]),
  PaymentController.getAllPayments
);
router.get(
  "/opens",
  handleAuth,
  verifyPermission(["ADNIN"]),
  PaymentController.getAllOpenPayments
);
router.get("/id", handleAuth, PaymentController.getLastUserPayment);
router.get(
  "/:id/last",
  handleAuth,
  verifyPermission(["ADNIN", "EMPLOYEE"]),
  PaymentController.getLastUserPayment
);
router.post("/:id", upload.single("file"), PaymentController.confirmPayment);
router.put("/:id", upload.single("file"), PaymentController.updatePayment);

export default router;
