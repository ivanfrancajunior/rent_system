import { Request, Response } from "express";
import { Payment, PaymentTypes } from "../models/Payment";
import { User } from "../models/User";
import { StatusCodes } from "http-status-codes";
import path from "path";
/*
export interface PaymentTypes {
  userId: string;
  fileUrl: string;
  paymentDate: Date;
  monthRef: string;
  status: "IS_OPEN" | "IS_CLOSED";
}
*/
export class PaymentController {
  static async confirmPayment(req: Request, res: Response) {
    const file = req.file;

    const { id } = req.params;

    const user = await User.findById(id);

    //verificar usuário
    if (!user)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "user not found" });

    //recuperar o arquivo
    if (!file)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "file is required" });

    const fileUrl = path.join("tmp", file.filename);

    console.log(fileUrl);

    //criar pagamento
    const new_payment = new Payment({
      userId: user._id,
      fileUrl,
      monthReference: new Date().toLocaleDateString("pt-BR", {
        month: "2-digit",
        year: "numeric",
      }),
    });

    const payment = await new_payment.save();

    user.payments.push(payment._id);

    await user.save();

    return res.status(StatusCodes.CREATED).json(payment);
  }

  static async getAllPayments(req: Request, res: Response) {
    const payments = await Payment.find();

    return res.status(StatusCodes.OK).json(payments);
  }

  static async getAllOpenPayments(req: Request, res: Response) {
    const payments = await Payment.find();

    const inOpen = payments.filter((payment) => payment.status === "IS_OPEN");

    return res.status(StatusCodes.OK).json(inOpen);
  }

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
    if (file) {
      payment.fileUrl = file.path;
    }

    await payment.save();


    return res.status(StatusCodes.OK).send();
  }
}
