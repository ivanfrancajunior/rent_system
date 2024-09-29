import dotenv from "dotenv";
dotenv.config();
import request from "supertest";
import mongoose from "mongoose";
import clientApp from "../server";
import { Payment } from "../models/Payment";
import fs from "fs";
const MONGO_URI_TEST_DB = process.env.MONGO_URI_TEST_DB;

const app = clientApp;

describe("paymentController", () => {
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URI_TEST_DB!)
      .then(() => console.log("connected to db"))
      .catch((err) => console.log(err));
  });

  afterEach(async () => {
    await Payment.deleteMany({});
    await mongoose.connection.close();
  });

  describe("createPayment method", () => {
    it("should create a new payment - status 201", async () => {
      const user = {
        name: "test user",
        address: "test address",
        phone: "12345678910",
        email: "test@email.com",
        password: "testing123",
        role: "ADMIN",
      };

      const filePath = `${__dirname}/testFiles/fakeFileToUpload.txt`;

      const userCreated = await request(app).post("/api/users/new").send(user);

      const authUser = await request(app).post("/api/users/login").send({
        email: user.email,
        password: user.password,
      });

      const token = await authUser.body.token;
      const id = await userCreated.body.id;

      console.log(id);

      console.log(token);

      const res = await request(app)
        .post(`/api/payments/new/`)
        .set("Authorization", `Bearer ${token}`)
        .attach("file", filePath);
      console.log(res.body);
    });

    // it("should not create a new payment without a file- status 400", async () => {
    //   const user = {
    //     name: "test user",
    //     address: "test address",
    //     phone: "12345678910",
    //     email: "test@email.com",
    //     password: "testing123",
    //   };

    // //   const filePath = `src/__tests__/testFiles/fakeFileToUpload.txt`;

    //   const userCreated = await request(app).post("/api/users/new").send(user);

    //   const authUser = await request(app).post("/api/users/login").send({
    //     email: user.email,
    //     password: user.password,
    //   });

    //   const token = await authUser.body.token;

    //   const res = await request(app)
    //     .post("/api/payments/new/" + userCreated.body.id)
    //     .set("Authorization", `Bearer ${token}`);
    //   expect(res.status).toBe(404);
    //   console.log(res.body);
    // });
  });
});
