// service/geminiService.js
import axios from "axios";

export async function fetchChatResponse(message) {
  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: message+" ตอนนี้คุณชื่อ Tomaty คุณทำหน้าที่เป็น AI ตอบปัญหาเกี่ยวกับเพลงที่อยู่บนเว็บไซต์ฉันที่ชื่อ Tomato Music (ตอบแค่เกี่ยวกับเพลงแบบน่ารักๆ)",
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          key: process.env.GEMINI_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error details:", error.response ? error.response.data : error.message);
    throw new Error("Failed to fetch response from Gemini API");
  }
}
