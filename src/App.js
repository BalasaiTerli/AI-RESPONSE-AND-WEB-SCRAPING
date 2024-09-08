import React, { useState } from "react";
import axios from "axios";
import "./index.css"; // Ensure Tailwind CSS is imported

function App() {
  const [url, setUrl] = useState("");
  const [query, setQuery] = useState("");
  const [scrapeResult, setScrapeResult] = useState("");
  const [responseResult, setResponseResult] = useState("");

  const handleScrape = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/scrape?url=${encodeURIComponent(url)}`
      );
      setScrapeResult(data.content);
    } catch (error) {
      console.error("Error fetching the page:", error);
    }
  };

  const handleGenerateResponse = async () => {
  try {
    const { data } = await axios.get(
      `http://localhost:5000/generate-response?query=${encodeURIComponent(query)}`
    );

    // Clean the response by removing numbers like {21}, [22], etc.
    const cleanedResponse = data.content.replace(/\[\d+\]|\{\d+\}/g, "").replace(/\s+/g, " ").trim();

    setResponseResult(cleanedResponse);
  } catch (error) {
    console.error("Error generating response:", error);
  }
};

  return (
    <div className="relative min-h-screen bg-gray-900 text-white p-8">

      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Web Scraping and AI Response Generator
        </h1>

        <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg w-full">
          <h2 className="text-2xl font-semibold mb-4">Scrape Web Content</h2>
          <input
            type="text"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg mb-4 text-white placeholder-gray-400 focus:outline-none"
          />

          <button
            onClick={handleScrape}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Scrape
          </button>
          {scrapeResult && (
            <div className="mt-4 p-4 bg-gray-700 border border-gray-600 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Scraped Content:</h3>
              <p>{scrapeResult}</p>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg mt-8 w-full">
          <h2 className="text-2xl font-semibold mb-4">Generate AI Response</h2>
          <input
            type="text"
            placeholder="Enter your query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg mb-4 text-white placeholder-gray-400 focus:outline-none"
          />

          <button
            onClick={handleGenerateResponse}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200"
          >
            Generate Response
          </button>
          {responseResult && (
            <div className="mt-4 p-4 bg-gray-700 border border-gray-600 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">AI Response:</h3>
              <p>{responseResult}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
