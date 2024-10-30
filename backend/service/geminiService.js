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
                text: message,
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
