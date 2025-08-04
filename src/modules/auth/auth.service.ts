import UserModel from "@db/models/user.model";
import { logger } from "@src/helpers/logger.helper";
import { hashing, compare } from "@utils/hash.utils";
import { SucRes } from "@utils/response.handler";
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
  // Hash the password
  const hashedPassword = await hashing({ plainText: password });
  logger.log("Password hashed successfully");
  const user = await UserModel.create({
    name,
    password: hashedPassword,
    email,
    age,
    phone,
  });
  SucRes({
    res,
    statusCode: 201,
    message: "User added successfully.",
    data: user,
  });
  // res.status(201).json({
  //   message: "User added successfully.",
  //   data: user,
  // });
};

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { password, email } = req.body;

  // Check if user exists
  const user = await UserModel.findOne({ email });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  const isMatched = await compare({
    plainText: password,
    hash: user.password,
  });
  if (!isMatched) {
    return next(new Error("Invalid credentials", { cause: 401 }));
  }
  // res.status(200).json({ message: "User logged in successfully" });
  SucRes({
    res,
    message: "User logged in successfully",
    data: user,
  });
};

export { signup, login };
