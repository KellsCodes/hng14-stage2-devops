const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();

// Create an agent to manage sockets efficiently
const httpAgent = new http.Agent({
  keepAlive: true,
  maxSockets: 100,
  timeout: 60000,
});

const API_URL = process.env.API_URL || "http://localhost:8000";

app.use(express.json());
app.use(express.static(path.join(__dirname, "views")));

app.post("/submit", async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/jobs`);
    res.status(201).json(response.data);
  } catch (err) {
    console.error("Job submission failed:", err.message);
    res.status(500).json({ error: "something went wrong" });
  }
});

app.get("/status/:id", async (req, res) => {
  // Use an AbortController to implement request timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await axios.get(`${API_URL}/jobs/${req.params.id}`, {
      signal: controller.signal, // Automatically cleans up on timeout
    });
    res.json(response.data);
  } catch (err) {
    if (err.name === "AbortError") {
      console.error("Request timed out");
      res.status(504).json({ error: "Request timed out" });
    } else if (err.response) {
      res.status(err.response.status).json({ error: err.response.data });
    } else {
      res.status(500).json({ error: "something went wrong" });
    }
  } finally {
    clearTimeout(timeoutId);
  }
});

app.listen(3000, () => {
  console.log("Frontend running on port 3000");
});
