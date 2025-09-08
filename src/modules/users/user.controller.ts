import { Router } from "express";
import { coverImages, getSingleUser, getUsers, updateProfileImage } from "./user.service";
import {
  authenticationMiddleware,
  authorizationMiddleware,
} from "@src/MiddleWares/authentication.middleware";
import { endPoints } from "./user.authorization";
import { fileValidation, localFileUpload, secureFileUpload } from "@utils/multer/local.util";
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
  secureFileUpload({
    customPath: 'User',
    validation: {
      allowedMimeTypes: fileValidation.allowedMimeTypes,
      maxSize: fileValidation.maxSize
    }
  }).single("profileImage"),
  updateProfileImage
);

userRouter.patch(
  "/cover-images",
  authenticationMiddleware,
  authorizationMiddleware({ accessRoles: endPoints.updateProfileImage }),
  secureFileUpload({
    customPath: 'User',
    validation: {
      allowedMimeTypes: fileValidation.allowedMimeTypes,
      maxSize: fileValidation.maxSize
    }
  }).array("coverImages",5),
  coverImages
);

export default userRouter;
