import UserModel from "@db/models/user.model";
import { verifyToken } from "@utils/token.utils";
import { Request, Response, NextFunction } from "express";

import { Document } from "mongoose";
import { IUser } from "@db/models/user.model";

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
  const decoded = verifyToken({
    token: authorization,
  });

  const user = await UserModel.findById({ _id: (decoded as DecodedToken)._id });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  req.user = user;
  next();
};
