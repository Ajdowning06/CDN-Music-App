const express = require('express');
const path = require('path');
const fs = require('fs');

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
    const randomeIndex = Math.floor(Math.random() * EDGE_LOCATIONS.length);
    const selectedEdge = EDGE_LOCATIONS[randomIndex];

    console.log(`[Geo-Routing] Request routed to Edge Location: ${selectedEdge.id} (${selectedEdge.region})`);

    return selectedEdge;
}
const app = express();
const port = 3000;

// Set up a path for the music files
const musicDir = path.join(__dirname, 'music');

app.use(express.static(path.join(__dirname, 'public')));

// Middleware to start timing the request (for response time measurement)
app.use((req, res, next) => {
    req.requestStartTime = Date.now();
    next();
});

// Endpoint to get the list of songs available
app.get('/songs', (req, res) => {
    fs.readdir(musicDir, (err, files) => {
        if (err) {
            console.error('Failed to read music directory:', err);
            return res.status(500).send('Error reading music files.');
        }

        const audioFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.mp3', '.aac', '.ogg'].includes(ext);
        });

        res.json(audioFiles);
    });
});

// Endpoint to serve a specific song file with caching and routing logic
app.get('/music/:songName', (req, res) => {
    const songName = req.params.songName;
    const songPath = path.join(musicDir, songName);
    
    // 1. Simulate Intelligent Routing (Functional Req 2)
    const edgeLocation = simulateGeoRouting(req);
    
    // 2. Check for Directory Traversal
    if (!songPath.startsWith(musicDir)) {
        console.error(`Security Warning: Directory traversal attempt for ${songName}`);
        return res.status(400).send('Invalid file path.');
    }

    // 3. Caching Logic (Functional Req 1)
    const cacheKey = `${edgeLocation.id}:${songName}`;
    const cachedItem = edgeCache.get(cacheKey);

    if (cachedItem && Date.now() < cachedItem.expiry) {
        // Cache Hit
        console.log(`[Edge Cache] Hit: Serving ${songName} from in-memory cache on ${edgeLocation.id}.`);
        
        // Non-Functional Req 1: Add simulated latency for performance measurement
        setTimeout(() => {
            res.setHeader('Content-Type', cachedItem.mimeType);
            res.send(cachedItem.data);
            
            // Measure and Log Response Time
            const responseTime = Date.now() - req.requestStartTime;
            console.log(`[Performance Metric] Response Time for ${songName}: ${responseTime}ms (Target: <100ms)`);
        }, edgeLocation.latencyMs / 2); // Divide by 2 to keep the first hop fast
        
        return;
    }

    // Cache Miss: Read from origin (disk)
    fs.readFile(songPath, (err, data) => {
        if (err) {
            console.error(`Failed to read file ${songName} from disk:`, err);
            return res.status(404).send('Song not found.');
        }

        // Determine MIME Type for proper streaming
        const mimeType = express.static.mime.lookup(songName) || 'audio/mpeg';

        // Store in Cache (Simulating Edge Storage)
        edgeCache.set(cacheKey, {
            data: data,
            mimeType: mimeType,
            expiry: Date.now() + CACHE_TTL,
            // Functional Req 3: Real-time update check (by expiration)
            createdAt: new Date().toISOString() 
        });

        console.log(`[Edge Cache] Miss: Caching file ${songName} and serving from origin on ${edgeLocation.id}.`);

        // Serve the newly loaded file
        // Non-Functional Req 1: Add simulated latency for performance measurement
        setTimeout(() => {
            res.setHeader('Content-Type', mimeType);
            res.send(data);
            
            // Measure and Log Response Time
            const responseTime = Date.now() - req.requestStartTime;
            console.log(`[Performance Metric] Response Time for ${songName}: ${responseTime}ms (Target: <100ms)`);
        }, edgeLocation.latencyMs);

    });
});

// Serve the static HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log('--- Edge CDN Simulation Initialized ---');
    console.log(`Cache TTL set to ${CACHE_TTL / 1000} seconds.`);
    console.log('---------------------------------------');
});