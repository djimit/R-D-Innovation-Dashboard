
import { GoogleGenAI, Type } from "@google/genai";
import { BAIN_ARTICLE_CONTEXT } from "../constants";

// Always initialize the client using the exact named parameter object and process.env.API_KEY
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePipelineStrategy = async (userQuery: string) => {
  const ai = getAI();
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `
      User Inquiry: ${userQuery}
      
      Based on the following context from the Bain & Company article on Pharma Innovation Bottlenecks:
      ${BAIN_ARTICLE_CONTEXT}
      
      Perform a deep-dive analysis. Think critically and provide a comprehensive strategy. 
      Analyze the bottlenecks, suggest AI interventions, and estimate NPV impact.
    `,
    config: {
      thinkingConfig: { thinkingBudget: 15000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          executiveSummary: { type: Type.STRING },
          bottleneckAnalysis: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          strategicRecommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          impactProjection: {
            type: Type.OBJECT,
            properties: {
              timeSaved: { type: Type.STRING },
              costSaved: { type: Type.STRING },
              npvIncrease: { type: Type.STRING }
            },
            required: ["timeSaved", "costSaved", "npvIncrease"]
          }
        },
        required: ["executiveSummary", "bottleneckAnalysis", "strategicRecommendations", "impactProjection"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const chatWithStrategist = async (message: string, history: { role: string, parts: { text: string }[] }[]) => {
    const ai = getAI();
    const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
            systemInstruction: `You are a Senior Pharmaceutical Strategy Consultant specialized in AI implementation at Djimit. 
            Your goal is to help pharma executives understand how to use Generative AI to break bottlenecks in R&D, 
            Clinical Trials, and Regulatory affairs. Reference the Bain & Company article concepts like 
            '20-30% cycle time reduction' and '$2.3B development costs' regularly.
            Keep responses professional, concise, and strategically focused.`
        },
        history: history // Preserve conversation context
    });
    
    const result = await chat.sendMessage({ message });
    return result.text;
};
