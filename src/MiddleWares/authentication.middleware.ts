import UserModel from "@db/models/user.model";
import { verifyToken } from "@utils/token.utils";
import { Request, Response, NextFunction } from "express";
import { Document } from "mongoose";
import { IUser } from "@db/models/user.model";
import { TokenType } from "@utils/enums";

interface AuthenticatedRequest extends Request {
  user?: (Document<unknown, {}, IUser> & IUser & { _id: unknown }) | undefined;
}

export interface DecodedToken {
  _id: string;
  [key: string]: any;
}

export const authenticationMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { authorization } = req.headers as {
    authorization?: string | undefined;
  };
  if (!authorization) {
    return next(new Error("Authorization token missing", { cause: 401 }));
  }

  const [bearer, token] = authorization.split(" ") || [];

  if (!bearer || !token) {
    return next(new Error("Invalid authorization header", { cause: 401 }));
  }

  // First verify the token to get the user ID
  const decoded = verifyToken({
    token,
    bearer
  }) as DecodedToken;

  const user = await UserModel.findById({ _id: decoded._id });
  
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  req.user = user;
  next();
};
