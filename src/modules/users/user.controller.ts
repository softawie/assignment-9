import { Router } from "express";
import { coverImages, getSingleUser, getUsers, updateProfileImage ,updatePassword} from "./user.service";
import {
  authenticationMiddleware,
  authorizationMiddleware,
} from "@src/MiddleWares/auth.middleware";
import { endPoints } from "./user.authorization";
import { fileValidation, localFileUpload, secureFileUpload } from "@utils/multer/local.util";
import { validate } from "@src/MiddleWares/validation.middleware";
import { signUpValidation, updatePasswordValidation } from "@modules/auth/auth.validation";
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

userRouter.patch(
  "/update-password",
  validate(updatePasswordValidation),
  authenticationMiddleware,
  authorizationMiddleware({ accessRoles: endPoints.updatePassword }),
  updatePassword
);

export default userRouter;
