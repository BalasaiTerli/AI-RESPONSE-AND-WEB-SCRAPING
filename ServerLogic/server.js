require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { OpenAI } = require("openai");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

// Create an Express application
const app = express();
app.use(cors()); // Enable CORS for all routes

// Apply rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter); // Apply rate limiting to all routes

const port = process.env.PORT || 5000;

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set correctly in your .env file
});

app.use(express.json()); // Add middleware to parse JSON requests

app.get("/scrape", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const pageText = $("h1, h2, h3, p").text();

    res.json({
      message: "Content extracted successfully",
      content: pageText,
    });
  } catch (error) {
    console.error("Error fetching the page:", error.message); // Log the error message
    res.status(500).json({ error: "Error fetching the page" });
  }
});

app.get("/generate-response", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: query }],
    });

    res.json({
      message: "Response generated successfully",
      content: response.choices[0].message.content.trim(),
    });
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.error("Rate limit exceeded:", error.response.data);
      res
        .status(429)
        .json({ error: "Rate limit exceeded. Please try again later." });
    } else {
      console.error(
        "Error generating response:",
        error.response ? error.response.data : error.message
      ); // Log detailed error information
      res.status(500).json({ error: "Error generating response" });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
