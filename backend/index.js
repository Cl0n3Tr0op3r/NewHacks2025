import express, { text } from "express"; // or: const express = require("express"); if using CommonJS
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
dotenv.config();

app.post('/', async (req, res) => {
  try {
    console.log("this is server")
    const {url} = req.body
    if (!url) {
      return res.status(400).json({ error: "Missing url" });
    } 
    let redditJsonUrl = url;
    if (!redditJsonUrl.endsWith(".json")) {
      redditJsonUrl += ".json";
    }
    const redditResp = await fetch(redditJsonUrl, {
    headers: {
      "User-Agent": "tldr-reddit-extension/1.0",
      "Accept": "application/json"
    }
    });
    console.log("here1")
    if (!redditResp.ok) {
      const text = await redditResp.json();
      return res.status(500).json({ error: "Failed to fetch Reddit data", text });
    }
    console.log("here")
    const redditData = await redditResp.json();
    const textOfPost = redditData[0].data.children[0].data.selftext
    const geminiResult = await callingGemini(textOfPost);
    return res.json({message: geminiResult})
  }
  catch (error) {
    console.log(error)

  }
})

const callingGemini = async(textOfPost) => {
  console.log("called helper function")
  const ai = new GoogleGenAI({});
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Summarize ${textOfPost} into 1 short bullet point`,
  });
  console.log(response.text)
  return response.text;
}
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});