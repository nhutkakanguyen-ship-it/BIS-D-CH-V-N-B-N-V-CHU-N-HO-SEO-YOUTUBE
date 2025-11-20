
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    const prompt = `Translate the following text to ${targetLanguage}. Provide only the translated text, without any additional explanations, introductory phrases, or labels.

Text to translate:
"""
${text}
"""

Translation:`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error translating text with Gemini API:", error);
    throw new Error("Failed to communicate with the translation service.");
  }
};

export interface YoutubeSeoResult {
  hashtags: string[];
  description: string;
  keywords: string[];
}

export const generateYoutubeSeo = async (title: string): Promise<YoutubeSeoResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate YouTube SEO metadata for a video with the title: "${title}".
      
      Ensure the output is in the same language as the provided title.
      
      1. Create 10-15 relevant hashtags.
      2. Write a HIGHLY ENGAGING, formatted video description (approx 150 words).
         - Structure it clearly with headings or sections.
         - Use relevant EMOJIS (e.g., 🎥, 🔥, ✅, 👇) to make it visually popping.
         - Use BULLET POINTS for key takeaways or features.
         - Include a "Subscribe" call-to-action.
      3. Generate 15-20 relevant keywords/tags.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of hashtags starting with #",
            },
            description: {
              type: Type.STRING,
              description: "The formatted video description with emojis and bullets",
            },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of keywords for tags",
            },
          },
          required: ["hashtags", "description", "keywords"],
        },
      },
    });

    // Parse the JSON response safely, handling potential markdown blocks
    let cleanText = response.text.trim();
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```(?:json)?\n/, '').replace(/```$/, '');
    }

    const result = JSON.parse(cleanText);
    return result as YoutubeSeoResult;

  } catch (error) {
    console.error("Error generating YouTube SEO:", error);
    throw new Error("Failed to generate SEO content.");
  }
};
