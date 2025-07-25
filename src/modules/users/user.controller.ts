import { Router } from "express";
import { getUsers } from "./user.service";
const userRouter = Router();

userRouter.get("/getUsers", getUsers);

export default userRouter;
