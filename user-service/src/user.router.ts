import express from "express"
import { UserController } from "./user.controller";

const router = express.Router();

router.post("/send-mess", UserController.sendMess);
router.get("/test", (req, res) => {
     res.sendStatus(200);
})

export default router;
