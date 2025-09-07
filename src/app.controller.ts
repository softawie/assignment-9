import express, { Express} from "express";
import { CheckDB } from "@db/connectionDB";
import userRouter from "@modules/users/user.controller";
import authRouter from "@modules/auth/auth.controller";
import { globalErrorHandler } from "@utils/globalError.handler";
import cors from "cors";


const bootstrap = async (app: Express) => {
  app.use(express.json());
  app.use(cors())
  await CheckDB();
  app.use("/uploads", express.static("./src/uploads"));
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
