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

  if (isRedditPostUrl(topic)) {
    // Handle specific Reddit post URL
    const prompt = `
      You are an expert at analyzing and summarizing online discussions.
      Analyze the Reddit post and its entire comment section from the URL: "${topic}"

      Provide your analysis in a JSON object with two keys: "summary" and "sensitivityScore".

      1.  "summary": A concise 'TL;DR' (Too Long; Didn't Read) of the original post and the overall discussion in the comments. Capture the main points, key arguments, and the general outcome of the conversation. Format this as a Markdown string.
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
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: {
                            type: Type.STRING,
                            description: "The TL;DR summary of the post and comments."
                        },
                        sensitivityScore: {
                            type: Type.INTEGER,
                            description: "The sensitivity score from 1 to 10."
                        }
                    },
                    required: ["summary", "sensitivityScore"]
                }
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
      You are an expert at summarizing online communities.
      Provide a concise 'TL;DR' (Too Long; Didn't Read) summary for the Reddit subreddit: "${topic}".

      Your summary should cover:
      1.  The main purpose and theme of the subreddit.
      2.  Common topics of discussion and post types.
      3.  The general tone and sentiment of the community.
      4.  Who the subreddit is for (the target audience).

      Keep the summary engaging, easy to read, and within 2-3 short paragraphs. Format the output in Markdown.
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return { summary: response.text };
    } catch (error)      {
      console.error("Error summarizing subreddit:", error);
      return { summary: "Sorry, I couldn't generate a summary for that subreddit. The AI might be busy, or the subreddit is too obscure. Please try another one." };
    }
  }
};