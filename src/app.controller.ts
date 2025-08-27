import express, { Express, Request, Response, NextFunction } from "express";
import { CheckDB } from "@db/connectionDB";
import userRouter from "@modules/users/user.controller";
import authRouter from "@modules/auth/auth.controller";
import dotenv from "dotenv";
import { EnvEnum } from "@utils/enums";
import { globalErrorHandler } from "@utils/globalError.handler";
import cors from "cors";
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
  app.use(cors())
  CheckDB();
  app.use("/", userRouter);
  app.use("/", authRouter);
  // not found route
  app.all("/*dummy", (req, res, next) => {
    // return res.status(404).json({ message: "Route not found" });
    return next(new Error("Route not found", { cause: 404 }));
  });
  // Global error handler
  app.use(globalErrorHandler);
};

export { bootstrap };
