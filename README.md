# Open Redirect Firewall

A comprehensive security package that prevents open redirect vulnerabilities by whitelisting allowed domains. Install once and stop worrying about redirect-based attacks.

<img width="1432" height="689" alt="image" src="https://github.com/user-attachments/assets/0c919afd-c710-422c-b76a-0108ab2de690" />


## 🛡️ What it does

Open redirect vulnerabilities occur when applications redirect users to arbitrary URLs without proper validation. This package provides:

- **Runtime protection** against open redirect attacks
- **Whitelist-based validation** for trusted domains
- **Multiple integration options** (Express middleware, React hooks, browser extension)
- **Comprehensive logging** of security violations
- **Flexible configuration** for different security requirements

## ✨ Features

- 🔒 **Core Firewall**: Validate redirect URLs against whitelisted domains
- 🌐 **Express Middleware**: Server-side protection for Node.js applications
- ⚛️ **React Hooks**: Client-side protection for React applications
- 🔧 **Browser Extension**: Universal client-side protection
- 📊 **Violation Logging**: Track and monitor security violations
- ⚙️ **Flexible Configuration**: Customize validation rules and behavior
- 🧪 **Comprehensive Testing**: Full test coverage for all components

## 🚀 Quick Start

### Installation

```bash
npm install open-redirect-firewall
```

### 🔌 Simple Plug-and-Play (Auto-Protection)

**Just add this one line to your app and all redirects are automatically protected:**

```javascript
// Add this anywhere in your app (index.js, main.js, etc.)
import { createBrowserProtector } from 'open-redirect-firewall';

// This automatically protects ALL redirects in your app
createBrowserProtector({
  allowedDomains: ['example.com', 'trusted-site.org', 'myapp.com']
});
```

**That's it!** Now all redirects are automatically protected:
- ✅ Link clicks are validated
- ✅ Form submissions are checked  
- ✅ Programmatic redirects are intercepted
- ✅ History API calls are validated
- ❌ Malicious redirects are blocked
- 📊 Violations are logged

**No code changes needed anywhere else in your app!**

### Basic Usage

```typescript
import { RedirectFirewall, createDefaultConfig } from 'open-redirect-firewall';

// Create firewall with allowed domains
const firewall = new RedirectFirewall({
  allowedDomains: ['example.com', 'trusted-site.org'],
  allowedSubdomains: false,
  allowLocalhost: false,
  logViolations: true
});

// Validate a redirect URL
const result = firewall.validateRedirect('https://example.com/dashboard');
console.log(result.allowed); // true

const maliciousResult = firewall.validateRedirect('https://malicious-site.com/steal-data');
console.log(maliciousResult.allowed); // false
console.log(maliciousResult.reason); // "Domain malicious-site.com not allowed"
```

## 🔧 Express Middleware

Protect your Express.js applications from open redirect vulnerabilities:

```typescript
import express from 'express';
import { createRedirectFirewallMiddleware } from 'open-redirect-firewall';

const app = express();

// Create middleware with configuration
const redirectFirewall = createRedirectFirewallMiddleware({
  allowedDomains: ['example.com', 'trusted-site.org'],
  redirectParam: 'redirect', // URL parameter to check
  fallbackUrl: '/dashboard', // Fallback URL for blocked redirects
  logViolations: true
});

// Apply middleware to routes
app.use('/auth', redirectFirewall);

// Example route that uses redirect parameter
app.get('/login', (req, res) => {
  // The middleware will automatically validate the redirect parameter
  // and either redirect safely or return an error
});
```

## ⚛️ React Integration

Use React hooks for client-side protection:

```typescript
import React from 'react';
import { useRedirectFirewall } from 'open-redirect-firewall';

function LoginComponent() {
  const { validateRedirect, safeRedirect } = useRedirectFirewall({
    allowedDomains: ['example.com', 'trusted-site.org'],
    onViolation: (result) => {
      console.error('Redirect blocked:', result.reason);
    }
  });

  const handleLogin = (redirectUrl: string) => {
    // Safely redirect after login
    safeRedirect(redirectUrl, '/dashboard');
  };

  return (
    <button onClick={() => handleLogin('https://example.com/dashboard')}>
      Login
    </button>
  );
}
```

## 🌐 Browser Extension

Universal client-side protection for any web application:

```typescript
import { createBrowserProtector } from 'open-redirect-firewall';

// Initialize browser protection
const protector = createBrowserProtector({
  allowedDomains: ['example.com', 'trusted-site.org']
}, {
  enabled: true,
  showNotifications: true,
  logToConsole: true,
  showInterstitial: true, // Enable interstitial confirmation
  onInterstitial: (url, callback) => {
    // Custom interstitial logic
    if (confirm(`Are you sure you want to visit ${url}?`)) {
      callback();
    }
  }
});

// The protector automatically intercepts:
// - window.location changes
// - Link clicks
// - Form submissions
// - History API calls
```

## ⚙️ Configuration Options

### Core Configuration

```typescript
interface RedirectFirewallConfig {
  allowedDomains: string[];        // List of trusted domains
  allowedSubdomains?: boolean;     // Allow subdomains of trusted domains
  allowLocalhost?: boolean;        // Allow localhost/private IPs
  allowRelativeUrls?: boolean;     // Allow relative URLs
  strictMode?: boolean;            // Enable strict URL sanitization
  logViolations?: boolean;         // Log security violations
  customValidator?: (url: string) => boolean; // Custom validation function
}

interface BrowserExtensionConfig {
  enabled: boolean;                // Enable/disable protection
  showNotifications: boolean;      // Show browser notifications
  logToConsole: boolean;           // Log to console
  showInterstitial?: boolean;      // Show confirmation before redirects
  onInterstitial?: (url, callback) => void; // Custom interstitial handler
  trustAllDomains?: boolean;       // Trust all domains but still show interstitial
  fullPageInterstitial?: boolean;  // Show full page instead of popup
  onFullPageInterstitial?: (url, callback) => void; // Custom full page handler
}
```

### Express Middleware Options

```typescript
interface ExpressFirewallOptions extends RedirectFirewallConfig {
  redirectParam?: string;          // URL parameter to check (default: 'redirect')
  redirectHeader?: string;         // Header to check (default: 'x-redirect-url')
  fallbackUrl?: string;            // Fallback URL for blocked redirects
  showInterstitial?: boolean;      // Enable interstitial confirmation
  onInterstitial?: (req, res, url) => void; // Custom interstitial handler
  redirectOptions?: {
    statusCode?: number;           // HTTP status code for redirects
    headers?: Record<string, string>; // Additional headers
  };
}
```

## 🛡️ Interstitial Confirmation

Add an extra layer of security with interstitial confirmation pages that ask users to confirm redirects before they happen:

### Browser Interstitial

```typescript
const protector = createBrowserProtector({
  allowedDomains: ['example.com']
}, {
  showInterstitial: true,
  onInterstitial: (url, callback) => {
    // Show a modal or confirmation dialog
    if (confirm(`Are you sure you want to visit ${url}?`)) {
      callback(); // Proceed with redirect
    }
    // If user cancels, callback is not called and redirect is blocked
  }
});
```

### Trust All Domains + Interstitial

```typescript
const protector = createBrowserProtector({
  allowedDomains: ['example.com'] // Still needed for validation logic
}, {
  trustAllDomains: true,           // Trust all domains but show interstitial
  showInterstitial: true,
  onInterstitial: (url, callback) => {
    // Show confirmation for ALL redirects, even trusted ones
    if (confirm(`Confirm redirect to ${url}?`)) {
      callback();
    }
  }
});
```

### Full Page Interstitial

```typescript
const protector = createBrowserProtector({
  allowedDomains: ['example.com']
}, {
  showInterstitial: true,
  fullPageInterstitial: true,      // Use full page instead of popup
  onFullPageInterstitial: (url, callback) => {
    // Render a full page confirmation
    document.body.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                  background: #f8f9fa; display: flex; justify-content: center; align-items: center;">
        <div style="background: white; padding: 40px; border-radius: 12px; text-align: center;">
          <h2>⚠️ Confirm Redirect</h2>
          <p>You are about to visit: <strong>${url}</strong></p>
          <button onclick="window.location.href='${url}'">Continue</button>
          <button onclick="history.back()">Cancel</button>
        </div>
      </div>
    `;
  }
});
```

### Express Interstitial

```typescript
const redirectFirewall = createRedirectFirewallMiddleware({
  allowedDomains: ['example.com'],
  showInterstitial: true,
  onInterstitial: (req, res, url) => {
    // Render a confirmation page
    res.send(`
      <h2>Confirm Redirect</h2>
      <p>You are about to visit: ${url}</p>
      <form method="GET" action="${req.url}">
        <input type="hidden" name="confirmed" value="true">
        <button type="submit">Continue</button>
      </form>
      <a href="/dashboard">Cancel</a>
    `);
  }
});
```

## 📊 Monitoring and Logging

Track security violations and monitor your application:

```typescript
const firewall = new RedirectFirewall({
  allowedDomains: ['example.com'],
  logViolations: true
});

// Validate some URLs
firewall.validateRedirect('https://malicious-site.com');
firewall.validateRedirect('https://phishing-site.com');

// Get violation history
const violations = firewall.getViolations();
console.log(violations);
// [
//   {
//     timestamp: Date,
//     originalUrl: 'https://malicious-site.com',
//     reason: 'Domain malicious-site.com not in whitelist'
//   },
//   ...
// ]

// Clear violation history
firewall.clearViolations();
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
npm test
```

The package includes tests for:
- Core firewall functionality
- URL validation utilities
- Express middleware
- React hooks
- Browser extension

## 🔒 Security Best Practices

1. **Whitelist Only Trusted Domains**: Only allow domains you control or trust
2. **Enable Violation Logging**: Monitor for attempted attacks
3. **Use Strict Mode**: Enable strict URL sanitization in production
4. **Regular Updates**: Keep the package updated for security patches
5. **Custom Validation**: Add custom validation rules for specific requirements

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Stop open redirect vulnerabilities before they happen. Install `open-redirect-firewall` today!** 
