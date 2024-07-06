import mongoose from "mongoose";

export interface PaymentTypes {
  userId: string;
  fileUrl: string;
  paymentDate: Date;
  monthRef: string;
  status: "IS_OPEN" | "IS_CLOSED";
}

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", require: true },
  fileUrl: { type: String, require: true },
  paymentDate: { type: Date, default: Date.now },
  monthRef: { type: String },
  status: { type: String, enum: ["IS_OPEN", "IS_CLOSED"], default: "IS_OPEN" },
});

export const Payment = mongoose.model("Payment", paymentSchema);
