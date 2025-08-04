const express = require('express');
const { createRedirectFirewallMiddleware } = require('../dist');

const app = express();
const PORT = process.env.PORT || 3000;

// Create redirect firewall middleware
const redirectFirewall = createRedirectFirewallMiddleware({
  allowedDomains: ['example.com', 'trusted-site.org', 'myapp.com'],
  allowedSubdomains: true,
  allowLocalhost: true,
  redirectParam: 'redirect',
  fallbackUrl: '/dashboard',
  logViolations: true
});

// Apply middleware to auth routes
app.use('/auth', redirectFirewall);

// Login route that uses redirect parameter
app.get('/auth/login', (req, res) => {
  // The middleware will automatically validate the redirect parameter
  // If valid, it will redirect to the safe URL
  // If invalid, it will redirect to the fallback URL
  res.send(`
    <h1>Login Page</h1>
    <p>Try these URLs to test the redirect firewall:</p>
    <ul>
      <li><a href="/auth/login?redirect=https://example.com/dashboard">Valid redirect</a></li>
      <li><a href="/auth/login?redirect=https://some-random-malicious-site.com/steal-data">Invalid redirect (should be blocked)</a></li>
      <li><a href="/auth/login?redirect=https://trusted-site.org/profile">Another valid redirect</a></li>
    </ul>
  `);
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  res.send('<h1>Dashboard</h1><p>Welcome to your dashboard!</p>');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Test the redirect firewall by visiting the login page');
}); 