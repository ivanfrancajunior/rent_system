import express from "express";
import userRoutes from "./routes/user.routes";
import paymentRoutes from "./routes/payment.routes";
import requestRoutes from "./routes/request.routes";
import dotenv from "dotenv";
import { asyncHandler } from "./middlewares/async-handler";
import "./config/dbConnection";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/requests", requestRoutes);

// app.use(asyncHandler);

app.get("/v1/api", (req, res) => {
  return res.json({ message: "app running" });
});

export { app };
