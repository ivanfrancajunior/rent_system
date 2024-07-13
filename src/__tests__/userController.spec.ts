import dotenv from "dotenv";
dotenv.config();
import request from "supertest";
import mongoose from "mongoose";
import clientApp from "../server";
import { User } from "../models/User";
const MONGO_URI_TEST_DB = process.env.MONGO_URI_TEST_DB;

const app = clientApp;

describe("userController", () => {
  beforeEach(async () => {
    await mongoose
      .connect(MONGO_URI_TEST_DB!)
      .then(() => console.log("connected to db"))
      .catch((err) => console.log(err));
  });

  afterEach(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe("createUser method", () => {
    it("should create a new user - status 201", async () => {
      const sut = {
        name: "test user",
        address: "test address",
        phone: "12345678910",
        email: "test@email.com",
        password: "testing123",
      };
      const res = await request(app).post("/api/users/new").send(sut);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("email", "test@email.com");
    });

    it("should not create a user with a same email - status 400", async () => {
      const sut = {
        name: "test user",
        address: "test address",
        phone: "12345678910",
        email: "test@email.com",
        password: "testing123",
      };
      await request(app).post("/api/users/new").send(sut);

      const res = await request(app).post("/api/users/new").send(sut);

      expect(res.statusCode).toEqual(400);

      expect(res.body).toHaveProperty("error", "User already exists");
    });

    it("should not create a user with an invalid email - status 400", async () => {
      const user = {
        name: "test user",
        address: "test address",
        phone: "12345678910",
        email: "test_wrong_email.com",
        password: "testing123",
      };

      const sut = await request(app).post("/api/users/new").send(user);

      expect(sut.statusCode).toEqual(400);

      expect(sut.body).toHaveProperty("errors", [
        "Enter a valid e-mail address.",
      ]);
    });
    it("should not create a user with an short password length - status 400", async () => {
      const user = {
        name: "test user",
        address: "test address",
        phone: "12345678910",
        email: "test@email.com",
        password: "test",
      };

      const sut = await request(app).post("/api/users/new").send(user);

      expect(sut.statusCode).toEqual(400);

      expect(sut.body).toHaveProperty("errors", [
        "The password needs at least 5 characters.",
      ]);
    });
  });
  describe("loginUser method", () => {
    it("should login successfully a user- status 200", async () => {
      const user = {
        name: "test user",
        address: "test address",
        phone: "12345678910",
        email: "test@email.com",
        password: "testing123",
      };

      await request(app).post("/api/users/new").send(user);
      const sut = await request(app).post("/api/users/login").send({
        email: user.email,
        password: user.password,
      });

      expect(sut.statusCode).toEqual(200);

      expect(sut.body).toHaveProperty("token");
    });
    it("should not login a user with a wrong email - status 404", async () => {
      const user = {
        name: "test user",
        address: "test address",
        phone: "12345678910",
        email: "test@email.com",
        password: "testing123",
      };

      await request(app).post("/api/users/new").send(user);

      const sut = await request(app).post("/api/users/login").send({
        email: "wrong_test@email.com",
        password: user.password,
      });

      expect(sut.statusCode).toEqual(404);

      expect(sut.body).toHaveProperty("error", "User not found.");
    });
    it("should not login a user with a invalid password - status 401", async () => {
      const user = {
        name: "test user",
        address: "test address",
        phone: "12345678910",
        email: "test@email.com",
        password: "testing123",
      };
      await request(app).post("/api/users/new").send(user);

      const sut = await request(app).post("/api/users/login").send({
        email: user.email,
        password: "asdsamsdamdsaasma",
      });

      expect(sut.statusCode).toEqual(401);
      expect(sut.body).toHaveProperty("error", "Wrong password");
    });
  });

  describe("getUsers method", () => {
    it("should not able to get all users without a token - status 401", async () => {
      const sut = await request(app).get("/api/users");

      expect(sut.statusCode).toEqual(401);

      expect(sut.body).toHaveProperty("errors", ["Not authorized"]);
    });

    it("should not able to get all users if user not have  a 'ADMIN' role - status 401", async () => {
      const user = {
        name: "test user",
        address: "test address",
        phone: "12345678910",
        email: "test@email.com",
        password: "testing123",
      };
      await request(app).post("/api/users/new").send(user);

      const signin_user = await request(app).post("/api/users/login").send({
        email: user.email,
        password: user.password,
      });

      const { token } = await signin_user.body;

      const sut = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${token}`);

      expect(sut.statusCode).toEqual(401);

      expect(sut.body).toHaveProperty("error", "Unauthorized");
    });

    it("should return all users if user has a ADMIN role - status 200", async () => {
      const adminUser = {
        name: "admin user",
        address: "admin address",
        phone: "12345678910",
        email: "admin@email.com",
        password: "admin123",
        role: "ADMIN",
      };

      await request(app).post("/api/users/new").send(adminUser);

      const admin_user = await request(app).post("/api/users/login").send({
        email: adminUser.email,
        password: adminUser.password,
      });

      const { token } = await admin_user.body;

      const sut = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${token}`);

      expect(sut.statusCode).toEqual(200);
      expect(sut.body).toBeInstanceOf(Array);
    });
  });
});
