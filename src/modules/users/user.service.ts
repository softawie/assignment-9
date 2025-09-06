import { Request, Response, NextFunction } from "express";
import UserModel from "../../db/models/user.model";
import { logger } from "@src/helpers/logger.helper";
import { SucRes } from "@utils/response.handler";
import { decrypt } from "@utils/encryptio.utils";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await UserModel.create(req.body);
    SucRes({
      res,
      statusCode: 201,
      message: "User added in successfully",
      data: user,
    });
  } catch (error) {
    logger.log(error);
    next(error);
  }
};

export const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  req.user.phone = decrypt({ cipherText: req.user.phone });
  SucRes({
    res,
    statusCode: 200,
    message: "User fetched successfully",
    data: { user: req.user },
  });
};

export const updateProfileImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  return SucRes({
    res,
    statusCode: 200,
    message: "Profile Image updated successfully",
    data: { file: req.file },
  });
};
