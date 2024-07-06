import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";

const router = Router();

router.get("/", PaymentController.getAllPayments);
router.get("/opens", PaymentController.getAllOpenPayments);
router.get("/id", PaymentController.getLastUserPayment);
router.get("/:id/last", PaymentController.getLastUserPayment);
router.post("/", PaymentController.confirmPayment);
router.put("/:id", PaymentController.updatePayment);

export default router;

//TODO: IMPLEMENT FILE UPLOAD + CONFIG CLOUDNARY + POST PAYMENT
//TODO: CHECK DUMMY ONE GET ROUTES(GET ALL / GET BY QUERY)
