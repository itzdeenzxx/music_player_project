// การนำเข้าที่มีอยู่
import express from "express";
import { getChatResponse } from "../controllers/chatController.js";

const router = express.Router();

// กำหนดเส้นทาง GET สำหรับการทดสอบ
router.get("/tomaty", (req, res) => {
  res.status(200).send("Use POST to submit a chat message.");
});

router.post("/tomaty", getChatResponse);

export default router;
