const express = require('express');
const path = require('path');
const app = express();

/**
 * Mwenebigimba Platform - Main Server Entry Point
 * 
 * This script handles:
 * 1. Device detection (Mobile vs. Desktop)
 * 2. Serving the appropriate high-fidelity interface
 * 3. Static asset routing
 */

// Middleware to detect device type from User Agent
app.use((req, res, next) => {
    const userAgent = req.headers['user-agent'];
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
    req.deviceType = isMobile ? 'mobile' : 'desktop';
    next();
});

// Serve static assets from the public directory app.use(express.static(path.join(__dirname, 'public')));

// Main Route - Serves the Master UI based on device
app.get('/', (req, res) => {
    if (req.deviceType === 'mobile') {
        res.sendFile(path.join(__dirname, 'public/mobile/index.html'));
    } else {
        res.sendFile(path.join(__dirname, 'public/desktop/index.html'));
    }
});
