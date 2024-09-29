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
  describe("getUser method", () => {
    it("should not able to get a user without a token - status 401", async () => {
      const sut = await request(app).get("/api/users/1");
      expect(sut.statusCode).toEqual(401);
      expect(sut.body).toHaveProperty("errors", ["Not authorized"]);
    });

    it("should return  a error with a invalid  user id - status 400", async () => {
      const query_user = {
        name: "user user",
        address: "user address",
        phone: "12345678910",
        email: "query_user@email.com",
        password: "user123",
      };

      const test_user = await request(app)
        .post("/api/users/new")
        .send(query_user);

      const id = "74";

      const auth_user = await request(app).post("/api/users/login").send({
        email: query_user.email,
        password: query_user.password,
      });

      const { token } = await auth_user.body;

      const sut = await request(app)
        .get("/api/users/" + id)
        .set("Authorization", `Bearer ${token}`);

      expect(sut.statusCode).toBe(400);
      expect(sut.body).toHaveProperty("error", "Invalid ID");
    });
    it("should able to get a user with a token and a valid id- status 401", async () => {
      const query_user = {
        name: "user user",
        address: "user address",
        phone: "12345678910",
        email: "query_user@email.com",
        password: "user123",
      };

      const test_user = await request(app)
        .post("/api/users/new")
        .send(query_user);

      const id = await test_user.body._id;

      const auth_user = await request(app).post("/api/users/login").send({
        email: query_user.email,
        password: query_user.password,
      });

      const { token } = await auth_user.body;

      const sut = await request(app)
        .get("/api/users/" + id)
        .set("Authorization", `Bearer ${token}`);

      expect(sut.statusCode).toBe(200);
      expect(sut.body).toHaveProperty("email", query_user.email);
      expect(sut.body).toHaveProperty("_id", id);
    });
  });

  describe("UpdateUser method", () => {
    it("should not able to update a user without a token - status 401", async () => {
      const current_user = {
        name: "current user",
        address: "current user address",
        phone: "12345678910",
        email: "current_user@email.com",
        password: "currentuser123",
      };

      const sut_user = await request(app)
        .post("/api/users/new")
        .send(current_user);

      const id = await sut_user.body._id;

      const auth_user = await request(app).post("/api/users/login").send({
        email: current_user.email,
        password: current_user.password,
      });

      const { token } = await auth_user.body;

      const sut = await request(app).put("/api/users/" + id);

      expect(sut.statusCode).toBe(401);
      expect(sut.body).toHaveProperty("errors", ["Not authorized"]);
    });
    it("should not able to update a user without a token and a 'ADMIN' role- status 401", async () => {
      const current_user = {
        name: "current user",
        address: "current user address",
        phone: "12345678910",
        email: "current_user@email.com",
        password: "currentuser123",
      };

      const sut_user = await request(app)
        .post("/api/users/new")
        .send(current_user);

      const id = await sut_user.body._id;

      const auth_user = await request(app).post("/api/users/login").send({
        email: current_user.email,
        password: current_user.password,
      });

      const { token } = await auth_user.body;

      const sut = await request(app)
        .put("/api/users/" + id)
        .set("Authorization", `Bearer ${token}`);

      expect(sut.statusCode).toBe(401);
      expect(sut.body).toHaveProperty("error", "Unauthorized");
    });
    it("should able to update a user with a 'ADMIN' role - status 200", async () => {
      const current_user = {
        name: "current user",
        address: "current user address",
        phone: "12345678910",
        email: "current_user@email.com",
        password: "currentuser123",
        role: "ADMIN",
      };

      const sut_user = await request(app)
        .post("/api/users/new")
        .send(current_user);

      const id = await sut_user.body._id;

      const auth_user = await request(app).post("/api/users/login").send({
        email: current_user.email,
        password: current_user.password,
      });

      const updated_fields = {
        name: "updated user",
        address: "updated user address",
        phone: "12345678910",
        email: "updated_user@email.com",
        password: "updateduser123",
      };
      const { token } = await auth_user.body;

      const sut = await request(app)
        .put("/api/users/" + id)
        .set("Authorization", `Bearer ${token}`)
        .send(updated_fields);

      expect(sut.statusCode).toBe(200);
      expect(sut.body).toHaveProperty("name", updated_fields.name);
      expect(sut.body).toHaveProperty("email", updated_fields.email);
      expect(sut.body).toHaveProperty("_id", id);
    });
  });
});
