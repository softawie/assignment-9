import { Request, Response, NextFunction } from "express";
import UserModel from "../../db/models/user.model";
import { logger } from "@src/helpers/logger.helper";
import { SucRes } from "@utils/response.handler";
import { decrypt } from "@utils/encryptio.utils";

// Types are globally augmented in src/types/multer-augmentations.d.ts

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
  try {
    if (!req.file?.path) {
      return next(new Error("No image file provided", { cause: 400 }));
    }
    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      { profileImage: req.file.finalPath },
      { new: true, runValidators: true }
    );
    if (!user) {
      return next(new Error("User not found", { cause: 404 }));
    }
    return SucRes({
      res,
      statusCode: 200,
      message: "Profile image updated successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const coverImages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
    // Normalize req.files to an array regardless of multer mode
    const filesArray: Express.Multer.File[] | undefined = Array.isArray(req.files)
      ? req.files
      : req.files
      ? Object.values(req.files).flat()
      : undefined;

    if (!filesArray?.length) {
      return next(new Error("No image file provided", { cause: 400 }));
    }
    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      { coverImages: filesArray.map((file) => file.finalPath) },
      { new: true, runValidators: true }
    );
    if (!user) {
      return next(new Error("User not found", { cause: 404 }));
    }
    return SucRes({
      res,
      statusCode: 200,
      message: "Cover images updated successfully",
      data: { file: filesArray },
    });
}
