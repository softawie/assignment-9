import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

export const signToken = ({
  payload = {},
  signature = process.env.JWT_SECRET!,
  options = { expiresIn: "1h" } as SignOptions,
}: {
  payload?: string | object | Buffer;
  signature?: jwt.Secret;
  options?: SignOptions;
}) => {
  return jwt.sign(payload, signature, options);
};

export const verifyToken = ({
  token = "",
  signature = process.env.JWT_SECRET!,
}: {
  token: string;
  signature?: jwt.Secret;
}) => {
  return jwt.verify(token, signature);
};
