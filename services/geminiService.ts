import { GoogleGenAI } from "@google/genai";

export const getStrategicInsight = async (problem: string) => {
  // Initialize GoogleGenAI instance right before the call to ensure the latest environment variables/API keys are used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a high-level strategic management recommendation for the following business challenge: "${problem}". Structure it with an executive summary, three actionable steps, and a potential risk assessment.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
        // Removed maxOutputTokens to prevent potential response truncation or blocking issues
      }
    });

    // Access .text property directly as per @google/genai guidelines
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Could not generate insight. Please try again.");
  }
};