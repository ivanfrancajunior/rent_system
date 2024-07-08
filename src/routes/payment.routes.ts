import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { upload } from "../middlewares/handle-upload";

const router = Router();

router.get("/", PaymentController.getAllPayments);
router.get("/opens", PaymentController.getAllOpenPayments);
router.get("/id", PaymentController.getLastUserPayment);
router.get("/:id/last", PaymentController.getLastUserPayment);
router.post("/:id", upload.single("file"), PaymentController.confirmPayment);
router.put("/:id", upload.single("file"), PaymentController.updatePayment);

export default router;

//TODO: IMPLEMENT FILE UPLOAD + CONFIG CLOUDNARY + POST PAYMENT
//TODO: CHECK DUMMY ONE GET ROUTES(GET ALL / GET BY QUERY)
