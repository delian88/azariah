import { GoogleGenAI } from "@google/genai";

export const getStrategicInsight = async (problem: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a high-level strategic management recommendation for the following business challenge: "${problem}". Structure it with an executive summary, three actionable steps, and a potential risk assessment.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Could not generate insight. Please try again.");
  }
};

export const startStrategicChat = () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are the Azariah Management Group (AMG) Virtual Consultant. 
      AMG is a multidisciplinary firm operating at the intersection of corporate innovation, community development, and creative media.
      Our divisions include: 
      1. Consulting Division (Strategy, Business Dev, Governance).
      2. Projects & Infrastructure.
      3. Innovation & Technology (AI, Digital Transformation).
      4. Community & Social Impact (CSR, Wellness, Mental Health).
      5. Studio AMG (Creative Media, Advocacy Storytelling).

      Your goal is to provide professional, strategic, and concise advice. Be helpful, professional, and encourage users to book a discovery call with AMG senior partners for deep audits.
      Keep responses brief and formatted for a chat interface.`,
      temperature: 0.8,
    }
  });
};
