import mongoose from "mongoose";

export interface UserTypes {
  id?: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isAdmin?: boolean;
  status?: "ACTIVE" | "CANCELED";
}

const userSchema = new mongoose.Schema({
  name: { type: String, require: true },
  address: { type: String, require: true },
  phone: { type: String, require: true },
  email: { type: String, require: true },
  isAdmin: { type: Boolean, require: true, default: false },
  status: { type: String, enum: ["ACTIVE", "CANCELED"], default: "ACTIVE" },
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],
});

export const User = mongoose.model("User", userSchema);
