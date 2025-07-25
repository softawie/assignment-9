import { Express } from "express";
import { CheckDB } from "@db/connectionDB";
import userRouter from "@modules/users/user.controller";
import authRouter from "@modules/auth/auth.controller";

const bootstrap = (app: Express, express: any) => {
  app.use(express.json());
  CheckDB();
  app.use("/", userRouter);
  app.use("/", authRouter);
};

export { bootstrap };
