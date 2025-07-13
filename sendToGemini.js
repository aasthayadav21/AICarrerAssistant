// src/api/sendToGemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("⚠️ Gemini API key is missing. Please check your .env file.");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const sendToGemini = async (userInput) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You're CareerBot 🤖, a helpful assistant for students and job seekers.
Answer clearly, politely, and concisely.

User question:
"${userInput}"

Respond helpfully in under 100 words.
`;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    return text;
  } catch (err) {
    console.error("❌ Gemini API error:", err);
    return "❌ Failed to connect to Gemini. Please try again later.";
  }
};
