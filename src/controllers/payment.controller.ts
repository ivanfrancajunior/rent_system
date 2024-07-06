import { Request, Response } from "express";
import { Payment, PaymentTypes } from "../models/Payment";
import { User } from "../models/User";
import { StatusCodes } from "http-status-codes";

class PaymentController {
  //realizar pagemento
  static async confirmPayment(req: Request, res: Response) {}

  //buscar pagementos
  static async getAllPayments(req: Request, res: Response) {
    const payments = await Payment.find();

    return res.status(StatusCodes.OK).json(payments);
  }

  //buscar pagementos em aberto
  static async getAllOpenPayments(req: Request, res: Response) {
    const payments = await Payment.find();

    const inOpen = payments.filter((payment) => payment.status === "IS_OPEN");

    return res.status(StatusCodes.OK).json(inOpen);
  }

  //buscar pagementos por id de usuário
  static async getUserPayments(req: Request, res: Response) {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "user not found" });

    const payments = await Payment.findById(user.id);

    return res.status(StatusCodes.OK).json(payments);
  }

  //buscar pagemento de usuário por mes
  static async getLastUserPayment(req: Request, res: Response) {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "user not found" });

    const payments = await Payment.find(user.id);

    const payment = payments.filter(
      (payment) => payment.status === "IS_CLOSED"
    );

    return res.status(StatusCodes.OK).json(payment);
  }

  //buscar pagementos por query
  static async getUsersPaymentsByQuery(req: Request, res: Response) {
    const { id } = req.params;

    const { date } = req.query;

    if (!date)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid args" });

    const user = await User.findById(id);

    if (!user)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "User not found" });

    const payments = await Payment.find(user.id);

    const payment = payments.find(
      (pay) => (pay.paymentDate.getMonth() + 1).toString() === date
    );

    if (!payment)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Unable to find payments for the selected month." });

    return res.status(StatusCodes.OK).json(payment);
  }

  // alterar pagamento
  static async updatePayment(req: Request, res: Response) {
    const { monthRef, status }: PaymentTypes = req.body;
    const file = req.file;
    const req_user = req.user;
    const { id } = req.params;

    const user = await User.findById(req_user?.id);

    if (!user)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "User not found" });

    const payment = await Payment.findById(id);

    if (!payment)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Payment not found" });

    if (monthRef) {
      payment.monthRef = monthRef;
    }
    if (status) {
      status === "IS_OPEN"
        ? payment.status === "IS_CLOSED"
        : payment.status === "IS_OPEN";
    }
    //TODO: IMPLEMENT FILE UPLOAD + CONFIG CLOUDNARY
    if (file) {
      payment.fileUrl = file.path;
    }

    await payment.save();

    return res.status(StatusCodes.OK).send();
  }
}
