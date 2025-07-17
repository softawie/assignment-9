import { Request, Response, NextFunction } from "express";
import UserModel from "../../db/models/user.model";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await UserModel.create(req.body);
    res.status(201).json({
      message: "User added successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
