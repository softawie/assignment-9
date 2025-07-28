import express, { Express, Request, Response, NextFunction } from "express";
import { CheckDB } from "@db/connectionDB";
import userRouter from "@modules/users/user.controller";
import authRouter from "@modules/auth/auth.controller";
import dotenv from "dotenv";
import { EnvEnum } from "@utils/enums";
dotenv.config();

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: EnvEnum;
    }
  }
}

const bootstrap = (app: Express) => {
  app.use(express.json());
  CheckDB();
  app.use("/", userRouter);
  app.use("/", authRouter);
  // not found route
  app.all("/*dummy", (req, res, next) => {
    // return res.status(404).json({ message: "Route not found" });
    return next(new Error("Route not found", { cause: 404 }));
  });
  // Global error handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode = typeof err.cause === "number" ? err.cause : 500;
    return res.status(statusCode).json({
      message: "Internal Server Error",
      error: err.message || "An unexpected error occurred",
      stack: process.env.NODE_ENV === EnvEnum.DEVELOPER ? err.stack : undefined,
    });
  });
};

export { bootstrap };
