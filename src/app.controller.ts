import { Express } from "express";
import { CheckDB } from "./db/connectionDB";
import userRouter from "./modules/users/user.controller.js";

const bootstrap = (app: Express, express: any) => {
  app.use(express.json());
  CheckDB();
  app.use("/", userRouter);
};

export { bootstrap };
