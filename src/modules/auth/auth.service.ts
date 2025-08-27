import UserModel from "@db/models/user.model";
import { logger } from "@src/helpers/logger.helper";
import { DecodedToken } from "@src/MiddleWares/authentication.middleware";
import { encrypt } from "@utils/encryptio.utils";
import { providersEnum } from "@utils/enums";
import { hashing, compare } from "@utils/hash.utils";
import { SucRes } from "@utils/response.handler";
import { signToken } from "@utils/token.utils";
import { Request, Response, NextFunction } from "express";
import  {OAuth2Client}from 'google-auth-library';

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

async function verifyGoogleAccount({ idToken }: { idToken: string }) {
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

interface User {
    email: string|undefined;
    email_verified: boolean|undefined;
    given_name: string|undefined;
    family_name: string|undefined;
    picture: string|undefined;
    provider: providersEnum;
}

const loginWithGmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { idToken }:DecodedToken = req.body;
  const payload = await verifyGoogleAccount({ idToken });
  if (!payload) {
    return next(new Error("Invalid Google token", { cause: 401 }));
  }
  const { email, email_verified, given_name, family_name, picture } = payload;
  if (!email_verified) {
    return next(new Error("Email not verified", { cause: 401 }));
  }
  let user = await UserModel.findOne({ email }) as User | null;
  if (user) {
    if (user.provider === providersEnum.GOOGLE) {
      const accessToken = signToken({
          payload: { _id: (user as any)._id },
          signature: process.env.JWT_SECRET!,
          options: { expiresIn: "1d", subject: "access" },
        });
        const refreshToken = signToken({
          payload: { _id: (user as any)._id },
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
      }
  } else {
    // Create a new user if not exists
    user = await UserModel.create({
      name: `${given_name} ${family_name}`,
      email,
      provider: providersEnum.GOOGLE,
      photo: picture,
      confirmEmail: Date.now()
    }) as unknown as User;
    logger.log("New user created via Google OAuth");
          const accessToken = signToken({
          payload: { _id: (user as any)._id },
          signature: process.env.JWT_SECRET!,
          options: { expiresIn: "1d", subject: "access" },
        });
        const refreshToken = signToken({
          payload: { _id: (user as any)._id },
          signature: process.env.JWT_SECRET!,
          options: {
            expiresIn: "7d",
            issuer: process.env.JWT_ISSUER!,
            subject: "refresh",
          },
        });
        SucRes({
          res,
          statusCode: 201,
          message: "User created successfully",
          data: { accessToken, refreshToken },
        });  
  }

};

export { signup, login,loginWithGmail };
