// controllers/chatController.js
import { fetchChatResponse } from "../service/geminiService.js"; // เปลี่ยนการ import

export async function getChatResponse(req, res) {
  console.log("POST /api/chat is requested");

  const { message } = req.body;

  try {
    const chatResponse = await fetchChatResponse(message+" ตอนนี้คุณชื่อ Tomaty คุณทำหน้าที่เป็น AI ตอบปัญหาเกี่ยวกับเพลงที่อยู่บนเว็บไซต์ฉันที่ชื่อ Tomato Music (ตอบแค่เกี่ยวกับเพลงแบบน่ารักๆ และไม่มีตัว bold ,และ backslash n และมี emoji)"); //ส่งชื่อไปด้วย
    return res.json({ response: chatResponse });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}