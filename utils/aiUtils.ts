import { GoogleGenAI } from "@google/genai";

// Lazy initialization to prevent app crash if key is missing on load
const getAiClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.warn("API Key is missing. AI features will be disabled.");
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

export const explainMath = async (expression: string, result: string): Promise<string> => {
  try {
    const ai = getAiClient();
    if (!ai) return "AI API Key is missing. Please configure it in your deployment settings.";

    const prompt = `
      You are a helpful math tutor. Explain this calculation in a very simple, easy-to-understand way, suitable for a beginner or a young student.
      
      Expression: "${expression}"
      Result: "${result}"
      
      Guidelines:
      1. Use **bold text** for the final answer and key numbers.
      2. Break it down into simple, short steps.
      3. Avoid complex jargon.
      4. Use Markdown formatting.
    `;
    
    // Using gemini-3-pro-preview for complex text tasks (STEM/Math)
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    return response.text || "Could not generate an explanation.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Sorry, I couldn't connect to the AI service. Please check your internet connection or API Key.";
  }
};

export const parseNaturalLanguage = async (query: string): Promise<string> => {
  try {
    const ai = getAiClient();
    if (!ai) throw new Error("API Key missing");

    const prompt = `Convert this natural language math request into a single mathematical expression that can be evaluated by a standard calculator (using mathjs syntax). 
    Return ONLY the expression. Do not add any text.
    Examples:
    Input: "sine of 90 degrees" -> Output: "sin(90 deg)"
    Input: "area of circle radius 5" -> Output: "pi * 5^2"
    Input: "${query}" -> Output:`;

    // Using gemini-3-pro-preview for complex text tasks (STEM/Math)
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
    });
    
    const text = response.text?.trim() || "";
    // Remove markdown code blocks if present
    return text.replace(/```/g, '').replace(/^math/,'').trim();
  } catch (error) {
    console.error("AI Error:", error);
    throw new Error("Could not understand the request.");
  }
};