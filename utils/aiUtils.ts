import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// Note: API Key must be in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const explainMath = async (expression: string, result: string): Promise<string> => {
  try {
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
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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
    const prompt = `Convert this natural language math request into a single mathematical expression that can be evaluated by a standard calculator (using mathjs syntax). 
    Return ONLY the expression. Do not add any text.
    Examples:
    Input: "sine of 90 degrees" -> Output: "sin(90 deg)"
    Input: "area of circle radius 5" -> Output: "pi * 5^2"
    Input: "${query}" -> Output:`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
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