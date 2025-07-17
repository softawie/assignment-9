import { Router } from "express";
import { createUser } from "./user.service";
const userRouter = Router();

userRouter.post("/signup", createUser);

export default userRouter;
