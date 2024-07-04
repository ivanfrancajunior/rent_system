import express from "express";
import userRoutes from "./routes/user.routes";
import dotenv from "dotenv";
import "./config/dbConnection";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/v1/api", (req, res) => {
  return res.json({ message: "app running" });
});

export { app };
