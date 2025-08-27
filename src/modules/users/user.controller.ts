import { Router } from "express";
import { getSingleUser, getUsers } from "./user.service";
import { authenticationMiddleware } from "@src/MiddleWares/authentication.middleware";
const userRouter = Router();

userRouter.get("/getUsers", getUsers);
userRouter.get("/getSingleUser", authenticationMiddleware, getSingleUser);
export default userRouter;
