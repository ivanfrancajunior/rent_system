import mongoose from 'mongoose'

export interface RequestTypes {
    id?: string;
    userId: mongoose.Schema.Types.ObjectId;
    assignedTo?: mongoose.Schema.Types.ObjectId;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
  }

  const requestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"], default: "PENDING" },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

  export const Request = mongoose.model<RequestTypes>("Request", requestSchema);