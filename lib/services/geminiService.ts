
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getWeb3Explanation = async (topic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain the following Web3/Starknet technical concept in 2 sentences for a developer audience. Topic: ${topic}`,
      config: {
        systemInstruction: "You are a senior blockchain engineer specialized in Starknet and ZK-rollups. Keep explanations concise, professional, and technical.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to fetch explanation. Please check your connectivity.";
  }
};
