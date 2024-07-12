import { Request, Response } from "express";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import { User, UserTypes } from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { generateHashPassword } from "../utils/generatePassword";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export class UserController {
  static async createUser(req: Request, res: Response): Promise<Response> {
    const { name, address, phone, email, password, role }: UserTypes = req.body;

    const already_exists = await User.findOne({ email });

    if (already_exists)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "User already exists" });

    const hashedPassword = await generateHashPassword(password);

    const user = await User.create({
      name,
      address,
      phone,
      email,
      password: hashedPassword,
      role,
    });

    if (!user)
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Something went wrong, try again later" });

    return res.status(StatusCodes.CREATED).json(user);
  }

  static async loginUser(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password!);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET!, {
      expiresIn: "7d",
    });

    return res.status(200).json({ token });
  }

  static async getUsers(req: Request, res: Response): Promise<Response> {
    const req_user = req.user;

    const users = await User.find();

    if (req_user?.role === "ADMIN") {
      return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Unauthorized" });
    }

    return res.status(StatusCodes.OK).json(users);
  }

  static async getUser(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "user not found" });

    return res.status(StatusCodes.OK).json(user);
  }

  static async updateUserProfile(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { name, address, phone, email, status } = req.body;

    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "user not found" });

    if (name) {
      user.name = name;
    }
    if (address) {
      user.address = address;
    }
    if (phone) {
      user.phone = phone;
    }
    if ((email && user.role === "ADMIN") || user.role === "EMPLOYEE") {
      user.email = email;
    }
    if ((status && user.role === "ADMIN") || user.role === "EMPLOYEE") {
      user.status = status;
    }

    await user.save();

    return res.status(StatusCodes.OK).json(user);
  }
}
