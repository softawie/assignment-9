import { Router } from "express";
import * as authService from "./auth.service";
import { authenticationMiddleware } from "@src/MiddleWares/authentication.middleware";
const authRouter = Router();

authRouter.post("/signup", authService.signup);
authRouter.post("/login", authService.login);
authRouter.post("/social-login", authService.loginWithGmail);
authRouter.post("/refresh-token",authenticationMiddleware, authService.refreshToken);
authRouter.patch("/confirm-email",authService.confirmEmail);

export default authRouter;

