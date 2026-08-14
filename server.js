const express = require('express');
‎const path = require('path');
‎const app = express();
‎
‎/**
‎ * Mwenebigimba Platform - Main Server Entry Point
‎ * 
‎ * UPDATED: OAuth 2.0 Integration for Deriv API
‎ */
‎
‎// Middleware to detect device type from User Agent
‎app.use((req, res, next) => {
‎    const userAgent = req.headers['user-agent'];
‎    const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
‎    req.deviceType = isMobile ? 'mobile' : 'desktop';
‎    next();
‎});
‎
‎// Serve static assets from the public directory
‎app.use(express.static(path.join(__dirname, 'public')));
‎
‎// OAuth 2.0 Callback Handler
‎// This catches the token from Deriv after a successful login
‎app.get('/callback', (req, res) => {
‎    const { token1, acct1, cur1 } = req.query;
‎    if (token1) {
‎        // In a real app, you would store this in a session or secure cookie
‎        // For now, we redirect to the main terminal with the auth state
‎        res.redirect(`/?token=${token1}&account=${acct1}&currency=${cur1}`);
‎    } else {
‎        res.redirect('/?error=auth_failed');
‎    }
‎});
‎
‎// Main Route - Serves the Master UI based on device
‎app.get('/', (req, res) => {
‎    if (req.deviceType === 'mobile') {
‎        res.sendFile(path.join(__dirname, 'public/mobile/index.html'));
‎    } else {
‎        res.sendFile(path.join(__dirname, 'public/desktop/index.html'));
‎    }
‎});
‎
‎// Health check endpoint
‎app.get('/status', (req, res) => {
‎    res.json({ 
‎        status: 'Mwenebigimba Engine Active', 
‎        auth_mode: 'OAuth 2.0',
‎        device: req.deviceType 
‎    });
‎});
‎
‎const PORT = process.env.PORT || 8080;
‎const DERIV_APP_ID = process.env.DERIV_APP_ID;
‎
‎app.listen(PORT, () => {
‎    console.log(`Mwenebigimba Institutional Terminal running on port ${PORT}`);
‎    console.log(`OAuth Redirect URL: https://${process.env.RAILWAY_STATIC_URL || 'your-app'}.up.railway.app/callback`);
‎});
