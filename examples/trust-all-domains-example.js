const { createBrowserProtector } = require('../dist/core');

console.log('=== Trust All Domains + Full Page Interstitial Example ===\n');

// Example 1: Trust all domains but show interstitial for everything
console.log('1. Trust All Domains Example:');
const trustAllProtector = createBrowserProtector({
  allowedDomains: ['example.com'] // Still needed for validation logic
}, {
  trustAllDomains: true,           // Trust all domains but show interstitial
  showInterstitial: true,
  logToConsole: true,
  onInterstitial: (url, callback) => {
    console.log(`🔍 Interstitial triggered for: ${url}`);
    console.log('   This would show a confirmation dialog in a real app');
    
    // Simulate user confirmation
    setTimeout(() => {
      console.log('   ✅ User confirmed - proceeding with redirect');
      callback();
    }, 1000);
  }
});

// Test with various URLs
const testUrls = [
  'https://example.com/dashboard',
  'https://some-random-malicious-site.com/steal-data',
  'https://trusted-site.org/profile',
  'https://evil.com/hack'
];

testUrls.forEach(url => {
  console.log(`\nTesting: ${url}`);
  const result = trustAllProtector.validateUrl(url);
  console.log(`   Validation result: ${result.allowed ? 'Allowed' : 'Blocked'}`);
  console.log(`   But with trustAllDomains=true, all URLs will show interstitial`);
});

// Example 2: Full page interstitial
console.log('\n\n2. Full Page Interstitial Example:');
const fullPageProtector = createBrowserProtector({
  allowedDomains: ['example.com', 'trusted-site.org']
}, {
  showInterstitial: true,
  fullPageInterstitial: true,      // Use full page instead of popup
  logToConsole: true,
  onFullPageInterstitial: (url, callback) => {
    console.log(`🔍 Full page interstitial triggered for: ${url}`);
    console.log('   This would render a full page confirmation in a real app');
    console.log('   Example HTML structure:');
    console.log(`
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                  background: #f8f9fa; display: flex; justify-content: center; align-items: center;">
        <div style="background: white; padding: 40px; border-radius: 12px; text-align: center;">
          <h2>⚠️ Confirm Redirect</h2>
          <p>You are about to visit: <strong>${url}</strong></p>
          <button onclick="proceed()">Continue</button>
          <button onclick="cancel()">Cancel</button>
        </div>
      </div>
    `);
    
    // Simulate user confirmation
    setTimeout(() => {
      console.log('   ✅ User confirmed - proceeding with redirect');
      callback();
    }, 1000);
  }
});

// Test full page interstitial
console.log('\nTesting full page interstitial:');
fullPageProtector.safeRedirect('https://example.com/dashboard');

console.log('\n\n=== Usage Summary ===');
console.log('✅ trustAllDomains: true - Trust all domains but show interstitial for everything');
console.log('✅ fullPageInterstitial: true - Show full page confirmation instead of popup');
console.log('✅ Both features can be used together or separately');
console.log('✅ Perfect for applications that want user confirmation for all external links'); 