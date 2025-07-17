import { Router } from "express";
import { createUser } from "./user.service.js";
const userRouter = Router();

userRouter.post("/signup", createUser);

export default userRouter;
