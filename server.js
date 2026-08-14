const express = require('express');
const path = require('path');
const app = express();

/**
 * Mwenebigimba Platform - Main Server Entry Point
 * 
 * SECURITY: This version uses Environment Variables for all sensitive keys.
 * NO SECRETS ARE STORED IN THIS CODE.
 */

// Load configuration from Environment Variables (Railway Variables Tab)
const DERIV_APP_ID = process.env.DERIV_APP_ID;
const DERIV_CLIENT_SECRET = process.env.DERIV_CLIENT_SECRET; // This stays hidden from GitHub
const PORT = process.env.PORT || 8080;

// Middleware to detect device type
app.use((req, res, next) => {
    const userAgent = req.headers['user-agent'];
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
    req.deviceType = isMobile ? 'mobile' : 'desktop';
    next();
});

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));

/**
 * OAuth 2.0 Callback Handler
 * Securely redirects the token to the frontend.
 * The Client Secret is available here for server-side token exchanges if needed.
 */
app.get('/callback', (req, res) => {
    const { token1, acct1, cur1 } = req.query;
    if (token1) {
        // Redirect to the UI with the token
        res.redirect(`/?token=${token1}&account=${acct1}&currency=${cur1}`);
    } else {
        res.redirect('/?error=auth_failed');
    }
});

// Main Route - Serves the Master UI
app.get('/', (req, res) => {
    if (req.deviceType === 'mobile') {
        res.sendFile(path.join(__dirname, 'public/mobile/index.html'));
    } else {
        res.sendFile(path.join(__dirname, 'public/desktop/index.html'));
    }
});

// Health check endpoint
app.get('/status', (req, res) => {
    res.json({ 
        status: 'Mwenebigimba Engine Active', 
        app_id_configured: !!DERIV_APP_ID,
        secret_configured: !!DERIV_CLIENT_SECRET, // Confirms secret is loaded without showing it
        auth_mode: 'OAuth 2.0'
    });
});

app.listen(PORT, () => {
    console.log(`Mwenebigimba Institutional Terminal running on port ${PORT}`);
    console.log(`System connected to App ID: ${DERIV_APP_ID || 'NOT_SET'}`);
});
