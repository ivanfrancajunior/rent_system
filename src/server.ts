import express from "express";

import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/v1/api", (req, res) => {
    
  return res.json({ message: "app running" });
});

export { app };
