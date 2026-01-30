
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStrategicInsight = async (problem: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a high-level strategic management recommendation for the following business challenge: "${problem}". Structure it with an executive summary, three actionable steps, and a potential risk assessment.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 1000,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Could not generate insight. Please try again.");
  }
};
