
import { GoogleGenAI, Type } from "@google/genai";
import { EmotionTag, ModerationResult, CommentTone } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this context, we simulate a missing key scenario for the UI.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const moderateStory = async (story: string): Promise<ModerationResult> => {
    if (!API_KEY) return { isSafe: true, reason: 'Moderation skipped: API key not configured.' }; // Bypass if no key
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the following user-submitted story for harmful content. Check for suicidal ideation, self-harm, graphic violence, hate speech, or severe trolling. The story should be respectful and safe for a mental health support community. Respond in JSON format with two fields: "isSafe" (boolean) and "reason" (a brief explanation if not safe, otherwise "Content is safe."). Story: "${story}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        isSafe: { type: Type.BOOLEAN },
                        reason: { type: Type.STRING }
                    }
                },
                thinkingConfig: { thinkingBudget: 0 }
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        return {
            isSafe: result.isSafe,
            reason: result.reason,
        };

    } catch (error) {
        console.error("Error in moderation check:", error);
        return { isSafe: false, reason: "Could not perform moderation check due to a technical error." };
    }
};

export const tagStory = async (story: string): Promise<EmotionTag[]> => {
    if (!API_KEY) return [EmotionTag.HEALING, EmotionTag.HOPE]; // Return default tags if no key
    const validTags = Object.values(EmotionTag);
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the following story and identify up to three dominant emotions from this list: ${validTags.join(', ')}. The story is about a personal mental health journey. Focus on the core feelings expressed. Story: "${story}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        tags: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: `An array of up to 3 emotion tags from the provided list.`
                        }
                    }
                },
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        // Filter to ensure API doesn't return invalid tags
        return result.tags.filter((tag: any) => validTags.includes(tag as EmotionTag));

    } catch (error) {
        console.error("Error in story tagging:", error);
        return [];
    }
};

export const generateSupportComment = async (story: string, tone: CommentTone): Promise<string> => {
    if (!API_KEY) return "This is a journey, and you are taking brave steps on its path. Remember to be kind to yourself.";
    try {
        let toneInstruction = "be gentle and comforting.";
        if (tone === CommentTone.MOTIVATIONAL) {
            toneInstruction = "be uplifting and motivational, focusing on strength and resilience.";
        } else if (tone === CommentTone.REFLECTIVE) {
            toneInstruction = "be calm and reflective, offering a gentle perspective.";
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `A person shared this story: "${story}". Please write a short, anonymous, supportive comment for them. Your response should be 1-2 sentences long. Your tone should ${toneInstruction} The comment must be validating and non-judgmental. Do not offer advice. Simply provide a message of support.`,
            config: {
                thinkingConfig: { thinkingBudget: 0 }
            }
        });

        return response.text.trim();

    } catch (error) {
        console.error("Error generating support comment:", error);
        return "There was an error generating a comment, but please know that your story is valued.";
    }
};
