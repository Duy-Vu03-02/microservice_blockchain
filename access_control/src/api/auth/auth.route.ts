import express from "express";
import { AuthMiddleware } from "./auth.middleware";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post("/login", AuthMiddleware.login, AuthController.login);

router.post(
  "/login-token",
  AuthMiddleware.loginByToken,
  AuthController.loginToken
);

router.get("/logout", AuthController.logOut);

export default router;
