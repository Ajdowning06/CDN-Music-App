const express = require('express');
const path = require('path');
const fs = require('fs');
/*
// Using a simple object for in-memory cache simulation
const edgeCache = new Map();
// Cache TTL (Time To Live) in milliseconds (e.g., 5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

// --- CDN Simulation: Edge Locations ---
// In a real CDN, these would be separate servers. Here, we simulate by defining
// the locations and assigning a request to one of them.
const EDGE_LOCATIONS = [
    { id: 'NYC-01', region: 'North America', latencyMs: 50 },
    { id: 'LON-05', region: 'Europe', latencyMs: 80 },
    { id: 'TOK-12', region: 'Asia', latencyMs: 150 }
];


function simulateGeoRouting(request) {
    const randomeIndex = Math.floor(Math.random() * EDGE_LOCATIONS.length)
}*/
const app = express();
const PORT = 3000;

// Paths to your frontend and music folders
const publicDir = path.join(__dirname, "public");
const musicDir = path.join(__dirname, "music");

// Serve static frontend files (index.html, styles.css, script.js)
app.use(express.static(publicDir));

// Serve music files from /music
app.use("/music", express.static(musicDir));

// Endpoint to get list of songs
app.get("/songs", (req, res) => {
    fs.readdir(musicDir, (err, files) => {
        if (err) {
            console.error("Error reading music folder:", err);
            return res.status(500).json({ error: "Failed to load songs" });
        }

        // Only include audio files
        const songs = files.filter(file =>
            [".mp3", ".wav", ".ogg", ".flac"].includes(path.extname(file).toLowerCase())
        );

        res.json(songs);
    });
});

// Fallback route to always serve index.html at "/"
app.get("/", (req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
});

// Start server
app.listen(PORT, () => {
    console.log(`🎵 Music CDN server running at http://localhost:${PORT}`);
});

