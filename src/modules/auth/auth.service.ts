import UserModel from "@db/models/user.model";
import { logger } from "@src/helpers/logger.helper";
import { Request, Response, NextFunction } from "express";

const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, password, email, age, phone } = req.body;
  //check if user already exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    // res.status(409).json({ message: "User already exists." });
    return next(new Error("User already exists", { cause: 409 }));
  }
  const user = await UserModel.create({
    name,
    password,
    email,
    age,
    phone,
  });
  res.status(201).json({
    message: "User added successfully.",
    data: user,
  });
};

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { password, email } = req.body;

  // Check if user exists
  const user = await UserModel.findOne({ email, password });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  // Logic for user login
  res.status(200).json({ message: "User logged in successfully" });
};

export { signup, login };
