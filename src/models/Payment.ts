import mongoose from "mongoose";

export interface PaymentTypes {
  userId: string;
  fileUrl: string;
  paymentDate: Date;
  monthRef: string;
}

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", require: true },
  fileUrl: { type: String, require: true },
  paymentDate: { type: Date, default: Date.now },
  monthRef: { type: String },
});

export const Payment = mongoose.model("Payment", paymentSchema);
