import { GoogleGenAI } from "@google/genai";

export interface StrategicResponse {
  text: string;
  sources?: Array<{ title: string; uri: string }>;
}

export const getStrategicInsight = async (problem: string): Promise<StrategicResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Provide a high-level strategic management recommendation for the following business challenge: "${problem}". 
      Use real-time information where relevant to provide context on current market trends.
      Structure it with an executive summary, three actionable steps, and a potential risk assessment.`,
      config: {
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 16384 },
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
    console.error("Gemini API Error:", error);
    throw new Error("Could not generate insight. Please check your connection and try again.");
  }
};

export const startStrategicChat = () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
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
      - Be human: If the user says "hello", respond with a warm greeting like "Hello! I'm doing well, thank you for asking. How are things with you today, and how can I help you navigate your strategic goals?"
      - Maintain context: Remember previous parts of the conversation.
      - Strategic Depth: While being conversational, always weave in AMG's expertise in strategy, impact, or technology when relevant.
      - Call to Action: Encourage booking a discovery call for deep-dive audits, but only when it feels natural in the flow.
      - Formatting: Use clear, readable paragraphs and bullet points for complex advice. Keep it interactive.`,
      temperature: 0.9,
    }
  });
};