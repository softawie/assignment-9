import { Router } from "express";
import { getSingleUser, getUsers, updateProfileImage } from "./user.service";
import {
  authenticationMiddleware,
  authorizationMiddleware,
} from "@src/MiddleWares/authentication.middleware";
import { endPoints } from "./user.authorization";
import { localFileUpload } from "@utils/multer/local.util";
const userRouter = Router();

userRouter.get("/getUsers", getUsers);
userRouter.get(
  "/getSingleUser",
  authenticationMiddleware,
  authorizationMiddleware({ accessRoles: endPoints.getSingleUser }),
  getSingleUser
);
userRouter.patch(
  "/update-profile-image",
  authenticationMiddleware,
  authorizationMiddleware({ accessRoles: endPoints.updateProfileImage }),
  localFileUpload().single("profileImage"),
  updateProfileImage
);

export default userRouter;
