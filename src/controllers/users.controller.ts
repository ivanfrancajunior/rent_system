import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { User, UserTypes } from "../models/Users";

export class UserController {
  static async createUser(req: Request, res: Response) {
    const { name, address, phone, email }: UserTypes = req.body;

    const already_exists = await User.findOne({ email });

    if (already_exists)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "User already exists" });

    const user = await User.create({
      name,
      address,
      phone,
      email,
    });

    if (!user)
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Something went wrong, try again later" });

    return res.status(StatusCodes.CREATED).json(user);
  }

  static async getUsers(req: Request, res: Response) {
    const user = req.user;

    if (!user?.isAdmin)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Unauthorized" });

    const users = await User.find({});

    return res.status(StatusCodes.OK).json(users);
  }

  static async getUser(req: Request, res: Response) {
    const { id } = req.body;

    const user = await User.findById(id);

    if (!user)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "user not found" });

    return res.status(StatusCodes.OK).json(user);
  }

  static async updateUserProfile(req: Request, res: Response) {
    const { name, address, email, phone }: UserTypes = req.body;

    const user = await User.findOne({ email }).select("-password");

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
  }
  //tornar inativo
  static async delete(req: Request, res: Response) {
    //TODO
  }

 //checar pagamentos

 //upload comprovante

//abrir solicitação

//verificar status da solicitação


}
