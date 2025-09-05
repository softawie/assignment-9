import { Router } from "express";
import { getSingleUser, getUsers } from "./user.service";
import { authenticationMiddleware, authorizationMiddleware } from "@src/MiddleWares/authentication.middleware";
import { endPoints } from "./user.authorization";
const userRouter = Router();

userRouter.get("/getUsers", getUsers);
userRouter.get("/getSingleUser", authenticationMiddleware, authorizationMiddleware({accessRoles:endPoints.getSingleUser}),getSingleUser);


export default userRouter;
