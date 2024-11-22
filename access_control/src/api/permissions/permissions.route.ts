import { AuthMiddleware } from "@api/auth/auth.middleware";
import { PermissionService } from "@common/permission/permission.service";
import express from "express";
import { PermissionController } from "./permissions.controller";

const router = express.Router();

router.post(
  "/change",
  AuthMiddleware.loginByToken,
  PermissionController.addPermission
);

router.post(
  "/remove",
  AuthMiddleware.loginByToken,
  PermissionController.removePermission
);

export default router;
