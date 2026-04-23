const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();
const http = require("http");

const API_URL = process.env.API_URL || "http://127.0.0.1:8000";
const PORT = process.env.PORT || 3000;

// Create an agent to manage sockets efficiently
const httpAgent = new http.Agent({
  keepAlive: true,
  maxSockets: 100, // Never allow more than 100 active sockets
  family: 4, // Use IPv4 to avoid localhost resolution loops
});

const api = axios.create({
  baseURL: API_URL,
  httpAgent,
  timeout: 5000, // Force timeout after 5s to release listeners
  proxy: false, // Prevents axios from adding extra proxy-related listeners
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "views")));

app.post("/submit", async (req, res) => {
  try {
    const response = await api.post(`/jobs`);
    res.status(201).json(response.data);
  } catch (err) {
    console.error("Job submission failed:", err.message);
    res.status(500).json({ error: "something went wrong" });
  }
});

app.get("/status/:id", async (req, res) => {
  try {
    const response = await api.get(`/jobs/${req.params.id}`);
    res.json(response.data);
  } catch (err) {
    if (err.response) {
      res.status(err.response.status).json({ error: err.response.data });
    } else {
      res.status(500).json({ error: "something went wrong" });
    }
  }
});

app.get("/health", async (req, res) => {
  try {
    res.status(200).send("OK");
  } catch (err) {
    res.status(500).json({ error: err.message || "something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Frontend running on port ${PORT}`);
});
