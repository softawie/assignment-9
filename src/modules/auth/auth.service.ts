import UserModel from "@db/models/user.model";
import { logger } from "@src/helpers/logger.helper";
import { encrypt } from "@utils/encryptio.utils";
import { hashing, compare } from "@utils/hash.utils";
import { SucRes } from "@utils/response.handler";
import { signToken } from "@utils/token.utils";
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
    return next(new Error("User already exists", { cause: 409 }));
  }
  // Hash the password
  const hashedPassword = await hashing({ plainText: password });
  logger.log("Password hashed successfully");
  const encryptedPhone = encrypt({ plainText: phone });
  const user = await UserModel.create({
    name,
    password: hashedPassword,
    email,
    age,
    phone: encryptedPhone,
  });
  SucRes({
    res,
    statusCode: 201,
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
  const accessToken = signToken({
    payload: { _id: user._id },
    signature: process.env.JWT_SECRET!,
    options: { expiresIn: "1d", subject: "access" },
  });
  const refreshToken = signToken({
    payload: { _id: user._id },
    signature: process.env.JWT_SECRET!,
    options: {
      expiresIn: "7d",
      issuer: process.env.JWT_ISSUER!,
      subject: "refresh",
    },
  });
  SucRes({
    res,
    message: "User logged in successfully",
    data: { accessToken, refreshToken },
  });
};

export { signup, login };
