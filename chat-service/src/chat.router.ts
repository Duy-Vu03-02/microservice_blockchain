import { ChatController } from "./chat.controller";
import express from "express";

const router = express.Router();

router.get("/my-mess", ChatController.getAllMessage);

export default router;