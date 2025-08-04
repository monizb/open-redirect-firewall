const { RedirectFirewall, createDefaultConfig } = require('../dist/core');

// Example 1: Basic usage
console.log('=== Basic Usage Example ===');

const firewall = new RedirectFirewall({
  allowedDomains: ['example.com', 'trusted-site.org', 'myapp.com'],
  allowedSubdomains: true,
  allowLocalhost: false,
  logViolations: true
});

// Test some URLs
const testUrls = [
  'https://example.com/dashboard',
  'https://some-random-malicious-site.com/steal-data',
  'https://trusted-site.org/profile',
  'https://sub.example.com/api',
  'http://localhost:3000',
  '/relative/path'
];

testUrls.forEach(url => {
  const result = firewall.validateRedirect(url);
  console.log(`${result.allowed ? '✅' : '❌'} ${url}`);
  if (!result.allowed) {
    console.log(`   Reason: ${result.reason}`);
  }
});

// Example 2: Using default config helper
console.log('\n=== Default Config Example ===');

const defaultConfig = createDefaultConfig(['example.com', 'trusted.org']);
const defaultFirewall = new RedirectFirewall(defaultConfig);

console.log('Default config:', defaultConfig);
console.log('Allowed domains:', defaultFirewall.getAllowedDomains());

// Example 3: Violation logging
console.log('\n=== Violation Logging Example ===');

firewall.validateRedirect('https://phishing-site.com/fake-login');
firewall.validateRedirect('https://evil.com/hack');

const violations = firewall.getViolations();
console.log(`Total violations: ${violations.length}`);
violations.forEach((violation, index) => {
  console.log(`Violation ${index + 1}:`);
  console.log(`  URL: ${violation.originalUrl}`);
  console.log(`  Reason: ${violation.reason}`);
  console.log(`  Timestamp: ${violation.timestamp}`);
});

// Example 4: Configuration updates
console.log('\n=== Configuration Updates Example ===');

console.log('Before update - localhost allowed:', firewall.validateRedirect('http://localhost:3000').allowed);

firewall.updateConfig({ allowLocalhost: true });

console.log('After update - localhost allowed:', firewall.validateRedirect('http://localhost:3000').allowed);

// Example 5: Custom validation
console.log('\n=== Custom Validation Example ===');

const customFirewall = new RedirectFirewall({
  allowedDomains: ['example.com'],
  customValidator: (url) => {
    // Only allow URLs with 'secure' in the path
    return url.includes('/secure/');
  }
});

console.log('Custom validator test:');
console.log('https://example.com/secure/dashboard:', customFirewall.validateRedirect('https://example.com/secure/dashboard').allowed);
console.log('https://example.com/public/dashboard:', customFirewall.validateRedirect('https://example.com/public/dashboard').allowed); 