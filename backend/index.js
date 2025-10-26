import express from "express"; // or: const express = require("express"); if using CommonJS
import cors from "cors";


const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// app.get("/", (req, res) => {
//   res.json({ message: "Hello world" });
// });

app.post('/', async (req, res) => {
  try {
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
    
    if (!redditResp.ok) {
      const text = await redditResp.json();
      return res.status(500).json({ error: "Failed to fetch Reddit data", text });
    }
    const redditData = await redditResp.json();
    const textOfPost = redditData[0].data.children[0].data.selftext
  }
  catch (error) {
    console.log(error)

  }
})

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});