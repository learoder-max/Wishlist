import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ParsedProduct {
  title: string;
  price?: number;
  currency?: string;
  description?: string;
  category?: string;
}

export const analyzeProductUrl = async (url: string): Promise<ParsedProduct | null> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Since we cannot scrape the URL content directly from the browser due to CORS and security,
    // we ask Gemini to infer details from the URL structure itself.
    // In a real production app, you would send the HTML content or use a proxy.
    
    const prompt = `
      You are an intelligent shopping assistant. 
      Analyze the following product URL string and extract the likely product information based on the text in the URL (slugs, query params, domain).
      
      URL: ${url}

      If the URL contains hints about the price, extract it. 
      Infer the product title and a short description.
      Infer the currency symbol if possible (default to $ if unknown but looks like a US site).
      
      Return JSON.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "The inferred name of the product" },
            price: { type: Type.NUMBER, description: "The inferred price if visible in URL, else null" },
            currency: { type: Type.STRING, description: "Currency symbol like $, €, etc." },
            description: { type: Type.STRING, description: "A short inferred description" },
            category: { type: Type.STRING, description: "Product category" }
          },
          required: ["title"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text) as ParsedProduct;

  } catch (error) {
    console.error("Failed to analyze URL with Gemini:", error);
    return {
      title: "",
      description: "Could not auto-fetch details."
    };
  }
};
