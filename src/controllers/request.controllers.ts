import { Request as Req, Response } from "express";
import { Request, RequestTypes } from "../models/Requests";
import { User } from "../models/User";
import { StatusCodes } from "http-status-codes";

export class RequestController {
  static async createRequest(req: Req, res: Response) {
    const req_user = req.user;

    const { description } = req.body;

    const user = await User.findById(req_user?.id);

    if (!user)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "User not found" });
    const request = new Request({
      userId: user._id,
      description,
      assignedTo: null,
    });

    await request.save();

    user.requests.push(request.id);

    await user.save();

    return res.status(StatusCodes.CREATED).send();
  }

  static async getRequests(req: Req, res: Response) {
    const { status } = req.query;

    const requests = await Request.find();

    if (!status) {
      return res.status(StatusCodes.OK).json(requests);
    }

    if (status && status === "PENDING") {
      const pending_request = requests.filter(
        (req) => req.status === "PENDING"
      );

      return res.status(StatusCodes.OK).json(pending_request);
    }

    if (status && status === "IN_PROGRESS") {
      const pending_request = requests.filter(
        (req) => req.status === "IN_PROGRESS"
      );

      return res.status(StatusCodes.OK).json(pending_request);
    }
    if (status && status === "COMPLETED") {
      const pending_request = requests.filter(
        (req) => req.status === "COMPLETED"
      );

      return res.status(StatusCodes.OK).json(pending_request);
    }

    if (status && status === "CANCELLED") {
      const pending_request = requests.filter(
        (req) => req.status === "CANCELLED"
      );

      return res.status(StatusCodes.OK).json(pending_request);
    }
  }

  static async getUserRequests(req: Req, res: Response) {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "User not found" });

    const requests = await Request.find({ userId: user._id });

    return res.status(StatusCodes.OK).json(requests);
  }

  static async updateRequests(req: Req, res: Response) {
    const { id } = req.params;
    const { description, assignedTo, status }: RequestTypes = req.body;
    const req_user = req.user;

    const user = await User.findById(req_user?.id);

    const request = await Request.findById(id);

    if (!request)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Item not found" });

    if (description) {
      request.description = description;
    }
    if (assignedTo && user?.role === "ADMIN") {
      request.assignedTo = assignedTo;
    }
    if ((status && user?.role === "ADMIN") || user?.role === "EMPLOYEE") {
      request.status = status;
    }

    await request.save();

    return res.status(StatusCodes.OK).json(request);
  }
}
