"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  async function shortenURL() {
    const res = await fetch("http://localhost:5000/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ original_url: url }),
    });

    const data = await res.json();
    setShortUrl(data.short_url);
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-4">TinyLink</h1>

        <input
          className="border p-2 w-full rounded mb-4"
          type="text"
          placeholder="Enter URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          onClick={shortenURL}
          className="bg-blue-600 text-white w-full p-2 rounded"
        >
          Shorten URL
        </button>

        {shortUrl && (
          <p className="mt-4 text-center">
            Short URL:{" "}
            <a
              href={shortUrl}
              target="_blank"
              className="text-blue-600 underline"
            >
              {shortUrl}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
