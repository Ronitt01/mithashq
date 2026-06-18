"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function askAI(question: string, context?: string) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return {
        answer: "AI assistant is not configured. Please set GEMINI_API_KEY in environment variables.",
      };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const systemPrompt = `You are MithasAI, the business assistant for MithasHQ — an ERP for sweet shops, dairy businesses, and namkeen manufacturers in India. You help business owners make data-driven decisions about inventory, production, sales, and payments.

You speak in a helpful, practical, business-focused tone. Keep responses concise (2-4 sentences). Use ₹ for currency. Be specific with actionable advice.

Business context: ${context || "General business query"}

User question: ${question}`;

    const result = await model.generateContent(systemPrompt);
    const response = result.response.text();

    return { answer: response };
  } catch (error) {
    console.error("AI error:", error);
    return {
      answer: "Sorry, I couldn't process your request right now. Please try again in a moment.",
    };
  }
}
