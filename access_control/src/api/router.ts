import express from "express";
import authRouter from "./auth/auth.route";
import permissionRouter from "./permissions/permissions.route";

const router = express.Router();

router.use("/permission", permissionRouter);

router.use("/auth", authRouter);

export default router;
