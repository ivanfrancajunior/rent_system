import mongoose from "mongoose";

export interface UserTypes {
    name: string;
    address: string;
    phone: string;
    email: string;
    isAdmin?: boolean;
    status?: "ACTIVE" | "CANCELED";
  }

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  address: { type: String, require: true },
  phone: { type: String, require: true },
  email: { type: String, require: true },
  isAdmin: { type: Boolean, require: true, default: false },
  status: { type: String, enum: ["ACTIVE", "CANCELED"], default: "ACTIVE" },
});

export const User = mongoose.model("User", userSchema);


