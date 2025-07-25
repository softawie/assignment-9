import UserModel from "@db/models/user.model";
import { logger } from "@src/helpers/logger.helper";
import { NextFunction } from "express";

import { Request, Response } from "express";

const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, password, email, age, phone } = req.body;
    //check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "User already exists." });
      return;
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
  } catch (error) {
    logger.log(error);
    next(error);
  }
};

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { password, email } = req.body;

    // Check if user exists
    const user = await UserModel.findOne({ email, password });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    // Logic for user login
    res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    logger.log(error);
    next(error);
  }
};

export { signup, login };
