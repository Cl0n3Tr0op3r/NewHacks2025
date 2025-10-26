import { GoogleGenAI, Type } from "@google/genai";

export interface RedditSummary {
  summary: string;
  sensitivityScore?: number;
}

const isRedditPostUrl = (text: string): boolean => {
  try {
    // A simple check to see if the input is a plausible URL and contains the key parts of a Reddit post URL.
    if (text.startsWith("http") && text.includes("reddit.com") && text.includes("/comments/")) {
        const url = new URL(text);
        return url.hostname.includes('reddit.com') && url.pathname.includes('/comments/');
    }
    return false;
  } catch (e) {
    return false;
  }
};

export const getTopicSummary = async (topic: string): Promise<RedditSummary> => {
  // The API key must be provided via environment variables.
  if (!process.env.API_KEY) {
    return { summary: "Error: API key is not configured in the environment." };
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const schema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "The summary."
        },
        sensitivityScore: {
            type: Type.INTEGER,
            description: "The sensitivity score from 1 to 10."
        }
    },
    required: ["summary", "sensitivityScore"]
  };

  if (isRedditPostUrl(topic)) {
    // Handle specific Reddit post URL
    const prompt = `
      You are a Reddit Summary Generator.
      Analyze the Reddit post and its entire comment section from the URL: "${topic}".

      Provide your analysis in a JSON object with two keys: "summary" and "sensitivityScore".

      1.  "summary": Generate a short, neutral summary for the post and comments using only the provided text. Make sentences as short as possible, containing only necessary words. Format this as a Markdown string.
      2.  "sensitivityScore": An integer from 1 to 10 rating the overall sensitivity and aggression of the discussion.
          - 1: Perfectly calm, respectful, and friendly.
          - 5: A mix of positive and negative comments, standard internet debate.
          - 10: Extremely aggressive, toxic, or filled with hate speech.
          Base this score on the language, tone, and level of conflict in the comments.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as RedditSummary;
    } catch (error) {
      console.error("Error summarizing Reddit post:", error);
      return { summary: "Sorry, I couldn't analyze that Reddit post. The AI might be busy, or the post is inaccessible. Please try another one." };
    }

  } else {
    // Handle subreddit name
    const prompt = `
      You are an expert at analyzing and summarizing online communities.
      Analyze the Reddit subreddit: "${topic}".

      First, analyze the top 10 posts and their comment sections to understand the community's current tone.
      Then, provide your analysis in a JSON object with two keys: "summary" and "sensitivityScore".

      1. "summary": A concise summary for the subreddit. It should cover:
          - The main purpose and theme.
          - Common topics of discussion.
          - The general tone and sentiment.
          - The target audience.
          Make sentences as short as possible, containing only necessary words. Format this as a Markdown string.

      2. "sensitivityScore": An integer from 1 to 10 rating the **average** sensitivity and aggression of the discussions across the top 10 posts.
          - 1: Perfectly calm, respectful, and friendly.
          - 5: A mix of positive and negative comments, standard internet debate.
          - 10: Extremely aggressive, toxic, or filled with hate speech.
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as RedditSummary;
    } catch (error)      {
      console.error("Error summarizing subreddit:", error);
      return { summary: "Sorry, I couldn't generate a summary for that subreddit. The AI might be busy, or the subreddit is too obscure. Please try another one." };
    }
  }
};