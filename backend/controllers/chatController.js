// controllers/chatController.js
import { fetchChatResponse } from "../service/geminiService.js"; // เปลี่ยนการ import

export async function getChatResponse(req, res) {
  console.log("POST /api/chat is requested");

  const { message } = req.body;

  try {
    const chatResponse = await fetchChatResponse(message); //ส่งชื่อไปด้วย
    return res.json({ response: chatResponse });
  } catch (error) {
    console.error(error); 
    return res.status(500).json({ error: error.message });
  }
}
