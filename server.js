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
const port = 3000;

// Set up a path for the music files.
// IMPORTANT: You will need to create a folder named 'music' in your project directory
// and place some audio files (e.g., MP3s) inside it.
const musicDir = path.join(__dirname, 'music');

// Serve the static HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to get the list of songs available in the music directory
app.get('/songs', (req, res) => {
    // Read the contents of the music directory
    fs.readdir(musicDir, (err, files) => {
        if (err) {
            console.error('Failed to read music directory:', err);
            return res.status(500).send('Error reading music files.');
        }

        // Filter for common audio file extensions
        const audioFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.mp3', '.aac', '.ogg'].includes(ext);
        });

        res.json(audioFiles);
    });
});

// Endpoint to serve a specific song file
app.get('/music/:songName', (req, res) => {
    const songPath = path.join(musicDir, req.params.songName);

    // Use a check to prevent directory traversal attacks
    if (songPath.indexOf(musicDir) !== 0) {
        return res.status(400).send('Invalid file path.');
    }

    res.sendFile(songPath, (err) => {
        if (err) {
            console.error('Failed to send file:', err);
            res.status(404).send('Song not found.');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log('Now you can open this URL in your web browser to start the music player.');
});
