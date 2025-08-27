import { Router } from "express";
import * as authService from "./auth.service";
const authRouter = Router();

authRouter.post("/signup", authService.signup);
authRouter.post("/login", authService.login);
authRouter.post("/social-login", authService.loginWithGmail);

export default authRouter;
