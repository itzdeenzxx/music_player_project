// controllers/chatController.js
import { fetchChatResponse } from "../service/geminiService.js";

export async function getChatResponse(req, res) {
  console.log("POST /chat/tomaty is requested");

  const { message } = req.body;

  try {
    const prompt = `'${message}' ***ตอนนี้คุณคือน้องมะเขือแดง เป็นผู้ช่วยผู้หญิงในเว็บ พูดลงท้ายว่า 'เจ้าค่ะ' ตอบคำถามเกี่ยวกับเพลงในเว็บไซต์ Tomato Music โดยใช้น้ำเสียงน่ารักและใช้ emoji ตอบมาเป็นประโยคความเดียว ไม่เอา bulletpoint***`;

    const chatResponse = await fetchChatResponse(prompt);
    return res.json({ response: chatResponse });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
