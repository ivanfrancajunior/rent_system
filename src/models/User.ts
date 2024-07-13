import mongoose from "mongoose";

export interface UserTypes {
  id: string;
  name: string;
  address: string;
  password: string;
  phone: string;
  email: string;
  isAdmin?: boolean;
  status?: "ACTIVE" | "CANCELED";
  payments?: mongoose.Schema.Types.ObjectId[];
  requests?: mongoose.Schema.Types.ObjectId[];
  role?: "ADMIN" | "EMPLOYEE" | "USER";
}

const userSchema = new mongoose.Schema({
  name: { type: String, require: true },
  password: { type: String, require: true },
  address: { type: String, require: true },
  phone: { type: String, require: true },
  email: { type: String, require: true },
  isAdmin: { type: Boolean, require: true, default: false },
  status: { type: String, enum: ["ACTIVE", "CANCELED"], default: "ACTIVE" },
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Request" }],
  role: {
    type: String,
    enum: ["ADMIN", "EMPLOYEE", "USER"],
  },
});

export const User = mongoose.model("User", userSchema);
