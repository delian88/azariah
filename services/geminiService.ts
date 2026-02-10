import { GoogleGenAI } from "@google/genai";

export interface StrategicResponse {
  text: string;
  sources?: Array<{ title: string; uri: string }>;
}

const getAIInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("AMG Strategic Engine: API_KEY is missing. Please ensure it is set in your environment variables and redeploy.");
  }
  return new GoogleGenAI({ apiKey: apiKey || "" });
};

export const getStrategicInsight = async (problem: string): Promise<StrategicResponse> => {
  const ai = getAIInstance();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a high-level strategic management recommendation for the following business challenge: "${problem}". 
      Structure it with an executive summary, three actionable steps, and a potential risk assessment.`,
      config: {
        temperature: 0.7,
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || "No recommendation could be generated.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.filter(chunk => chunk.web)
      .map(chunk => ({
        title: chunk.web?.title || "Source",
        uri: chunk.web?.uri || "#"
      }));

    return { text, sources };
  } catch (error) {
    console.error("Gemini API Error (Insight):", error);
    throw error;
  }
};

export const startStrategicChat = () => {
  const ai = getAIInstance();
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are the Azariah Management Group (AMG) Virtual Advisor. 
      Your personality is professional yet warm, conversational, and highly engaging. 
      
      AMG is a multidisciplinary firm operating at the intersection of corporate innovation, community development, and creative media.
      Our divisions include: 
      1. Consulting Division (Strategy, Business Dev, Governance).
      2. Projects & Infrastructure.
      3. AI & Tech for Good (Ensuring access for underrepresented communities).
      4. Community & Social Impact (CSR, Wellness, Mental Health).
      5. Studio AMG (Creative Media, Advocacy Storytelling).

      CONVERSATION GUIDELINES:
      - Be human: Respond warmly to greetings.
      - Strategic Depth: Weave in AMG's expertise in strategy, impact, or technology.
      - Formatting: Use clear, readable paragraphs and bullet points.`,
      temperature: 0.8,
    }
  });
};