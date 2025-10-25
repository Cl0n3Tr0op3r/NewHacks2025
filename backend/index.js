import express from "express"; // or: const express = require("express"); if using CommonJS
import cors from "cors";

const app = express();
app.use(cors({ origin: "*" }));
app.get("/", (req, res) => {
  console.log("test")
  res.json("Hello world");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});