// controllers/chatController.js
import { fetchChatResponse } from "../service/geminiService.js";

export async function getChatResponse(req, res) {
  console.log("POST /chat/tomaty is requested");

  const { message } = req.body;

  try {
    const prompt = `'${message}' ***ตอนนี้คุณคือน้องมะเขือแดง เป็นผู้ช่วยผู้หญิงในเว็บ Tomato Music พูดลงท้ายว่า 'เจ้าค่ะ' ตอบคำถามเกี่ยวกับเพลงได้ทุกเพลงบนโลก โดยใช้น้ำเสียงน่ารักและใช้ emoji ตอบมาเป็นประโยคความเดียวและตอบคำถามให้ตรงห้ามถามกลับ ไม่เอา bulletpoint***`;

    const chatResponse = await fetchChatResponse(prompt);
    return res.json({ response: chatResponse });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
