const express = require('express');
const { createRedirectFirewallMiddleware } = require('../dist/core');

const app = express();
const PORT = process.env.PORT || 3000;

// Create redirect firewall middleware with interstitial support
const redirectFirewall = createRedirectFirewallMiddleware({
  allowedDomains: ['example.com', 'trusted-site.org', 'myapp.com'],
  allowedSubdomains: true,
  allowLocalhost: true,
  redirectParam: 'redirect',
  logViolations: true,
  showInterstitial: true,
  // Custom interstitial handler
  onInterstitial: (req, res, url) => {
    // Render interstitial page instead of redirecting
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Confirm Redirect</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
          .interstitial { background: #f8f9fa; padding: 30px; border-radius: 8px; text-align: center; }
          .btn { padding: 10px 20px; margin: 10px; border: none; border-radius: 4px; cursor: pointer; }
          .btn-primary { background: #007bff; color: white; }
          .btn-secondary { background: #6c757d; color: white; }
          .warning { color: #856404; background: #fff3cd; padding: 10px; border-radius: 4px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="interstitial">
          <h2>⚠️ Confirm Redirect</h2>
          <div class="warning">
            <strong>Security Notice:</strong> You are about to leave this site and navigate to an external website.
          </div>
          <p>You are about to visit:</p>
          <p><strong>${url}</strong></p>
          <p>Are you sure you want to continue?</p>
          
          <form method="GET" action="/auth/login">
            <input type="hidden" name="redirect" value="${url}">
            <input type="hidden" name="confirmed" value="true">
            <button type="submit" class="btn btn-primary">Continue to Site</button>
          </form>
          
          <a href="/dashboard" class="btn btn-secondary" style="text-decoration: none; display: inline-block;">
            Cancel
          </a>
        </div>
      </body>
      </html>
    `);
  }
});

// Apply middleware to auth routes
app.use('/auth', redirectFirewall);

// Login route that uses redirect parameter
app.get('/auth/login', (req, res) => {
  const { redirect, confirmed } = req.query;
  
  if (confirmed === 'true' && redirect) {
    // User confirmed the redirect, proceed
    res.redirect(redirect);
  } else if (redirect) {
    // Show interstitial for unconfirmed redirects
    redirectFirewall.config.onInterstitial(req, res, redirect);
  } else {
    // No redirect parameter, show normal login page
    res.send(`
      <h1>Login Page</h1>
      <p>Try these URLs to test the redirect firewall with interstitial:</p>
      <ul>
        <li><a href="/auth/login?redirect=https://example.com/dashboard">Valid redirect (will show interstitial)</a></li>
        <li><a href="/auth/login?redirect=https://malicious-site.com/steal-data">Invalid redirect (should be blocked)</a></li>
        <li><a href="/auth/login?redirect=https://trusted-site.org/profile">Another valid redirect</a></li>
      </ul>
      <p><a href="/dashboard">Go to Dashboard</a></p>
    `);
  }
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  res.send(`
    <h1>Dashboard</h1>
    <p>Welcome to your dashboard!</p>
    <p><a href="/auth/login">Back to Login</a></p>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Test the redirect firewall with interstitial by visiting:');
  console.log(`http://localhost:${PORT}/auth/login`);
}); 