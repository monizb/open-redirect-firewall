const { createBrowserProtector } = require('open-redirect-firewall');

console.log('=== Custom Interstitial Examples ===\n');

// Example 1: Basic Custom Theme
console.log('1. Basic Custom Theme Example:');
const basicThemeProtector = createBrowserProtector({
  allowedDomains: ['example.com', 'trusted-site.org']
}, {
  showInterstitial: true,
  customInterstitial: {
    theme: {
      primaryColor: '#e74c3c',      // Red theme
      secondaryColor: '#95a5a6',
      successColor: '#27ae60',
      backgroundColor: '#2c3e50',    // Dark background
      surfaceColor: '#34495e',
      textColor: '#ecf0f1',
      borderRadius: '12px',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    },
    content: {
      title: 'External Link Warning',
      description: 'You are about to leave our secure site.',
      urlDisplay: 'Destination:',
      confirmButtonText: 'Proceed',
      cancelButtonText: 'Go Back'
    },
    type: 'popup'
  }
});

// Example 2: Full Page Custom Theme
console.log('\n2. Full Page Custom Theme Example:');
const fullPageProtector = createBrowserProtector({
  allowedDomains: ['example.com']
}, {
  showInterstitial: true,
  customInterstitial: {
    theme: {
      primaryColor: '#9b59b6',      // Purple theme
      secondaryColor: '#8e44ad',
      successColor: '#2ecc71',
      backgroundColor: '#f8f9fa',
      surfaceColor: '#ffffff',
      textColor: '#2c3e50',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      fontFamily: '"Helvetica Neue", Arial, sans-serif',
      headingFontSize: '32px',
      padding: '40px'
    },
    content: {
      title: 'Security Verification Required',
      description: 'For your protection, we need to verify this external link.',
      urlDisplay: 'You are about to visit:',
      warningText: 'This site is not affiliated with our organization.',
      confirmButtonText: '✅ Continue to External Site',
      cancelButtonText: '❌ Stay on This Site',
      footerText: 'Your security is our top priority.'
    },
    type: 'fullpage'
  }
});

// Example 3: Corporate Branding Theme
console.log('\n3. Corporate Branding Theme Example:');
const corporateProtector = createBrowserProtector({
  allowedDomains: ['company.com', 'partner.com']
}, {
  showInterstitial: true,
  customInterstitial: {
    theme: {
      primaryColor: '#1e3a8a',      // Corporate blue
      secondaryColor: '#64748b',
      successColor: '#059669',
      backgroundColor: '#f1f5f9',
      surfaceColor: '#ffffff',
      textColor: '#1e293b',
      borderColor: '#e2e8f0',
      borderRadius: '8px',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: '14px',
      headingFontSize: '20px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    content: {
      title: 'External Link Notice',
      description: 'You are leaving our corporate network.',
      urlDisplay: 'External destination:',
      warningText: 'This external website is not under our control.',
      confirmButtonText: 'Continue',
      cancelButtonText: 'Cancel',
      footerText: 'For security questions, contact IT support.'
    },
    type: 'popup'
  }
});

// Example 4: Custom HTML Template
console.log('\n4. Custom HTML Template Example:');
const customHTMLProtector = createBrowserProtector({
  allowedDomains: ['example.com']
}, {
  showInterstitial: true,
  customInterstitial: {
    content: {
      customHTML: `
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          font-family: 'Arial', sans-serif;
        ">
          <div style="
            background: white;
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            max-width: 500px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          ">
            <div style="
              width: 80px;
              height: 80px;
              background: #ff6b6b;
              border-radius: 50%;
              margin: 0 auto 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 40px;
            ">⚠️</div>
            
            <h2 style="color: #2c3e50; margin-bottom: 20px;">External Link Detected</h2>
            
            <p style="color: #7f8c8d; margin-bottom: 20px;">
              You're about to visit an external website that's not part of our network.
            </p>
            
            <div style="
              background: #ecf0f1;
              padding: 15px;
              border-radius: 10px;
              margin: 20px 0;
              font-family: monospace;
              word-break: break-all;
            ">
              {{URL}}
            </div>
            
            <div style="margin-top: 30px;">
              <button onclick="{{CONFIRM_CALLBACK}}" style="
                background: #27ae60;
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 25px;
                margin-right: 10px;
                cursor: pointer;
                font-weight: bold;
              ">Continue</button>
              
              <button onclick="{{CANCEL_CALLBACK}}" style="
                background: #e74c3c;
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 25px;
                cursor: pointer;
                font-weight: bold;
              ">Cancel</button>
            </div>
          </div>
        </div>
      `
    }
  }
});

// Example 5: Minimalist Theme
console.log('\n5. Minimalist Theme Example:');
const minimalistProtector = createBrowserProtector({
  allowedDomains: ['example.com']
}, {
  showInterstitial: true,
  customInterstitial: {
    theme: {
      primaryColor: '#000000',
      secondaryColor: '#666666',
      backgroundColor: '#ffffff',
      surfaceColor: '#ffffff',
      textColor: '#000000',
      borderColor: '#e0e0e0',
      borderRadius: '0px',
      boxShadow: 'none',
      fontFamily: '"SF Mono", Monaco, "Cascadia Code", monospace',
      fontSize: '12px',
      headingFontSize: '16px',
      padding: '20px',
      spacing: '12px'
    },
    content: {
      title: 'EXTERNAL LINK',
      description: 'You are leaving this site.',
      urlDisplay: 'URL:',
      confirmButtonText: 'CONTINUE',
      cancelButtonText: 'CANCEL'
    },
    type: 'popup'
  }
});

// Example 6: Trust All Domains with Custom Theme
console.log('\n6. Trust All Domains with Custom Theme:');
const trustAllProtector = createBrowserProtector({
  allowedDomains: ['example.com'] // Still needed for validation logic
}, {
  trustAllDomains: true,           // Trust all domains but show interstitial
  showInterstitial: true,
  customInterstitial: {
    theme: {
      primaryColor: '#ff6b35',     // Orange theme
      secondaryColor: '#f7931e',
      successColor: '#4caf50',
      backgroundColor: '#fff8e1',
      surfaceColor: '#ffffff',
      textColor: '#3e2723',
      borderRadius: '16px',
      fontFamily: '"Comic Sans MS", cursive, sans-serif',
      fontSize: '18px',
      headingFontSize: '28px'
    },
    content: {
      title: 'Link Confirmation',
      description: 'Please confirm you want to visit this link.',
      urlDisplay: 'Link:',
      confirmButtonText: 'Yes, go there!',
      cancelButtonText: 'No, stay here',
      footerText: 'We trust you to make the right choice! 😊'
    },
    type: 'fullpage'
  }
});

console.log('\n=== Usage Instructions ===');
console.log('✅ Each example demonstrates different customization options:');
console.log('   - Theme colors, fonts, spacing, and styling');
console.log('   - Custom content and messaging');
console.log('   - Popup vs full-page layouts');
console.log('   - Custom HTML templates with placeholders');
console.log('   - Trust all domains with custom styling');
console.log('\n✅ Placeholders for custom HTML:');
console.log('   - {{URL}} - The destination URL');
console.log('   - {{CONFIRM_CALLBACK}} - Continue button action');
console.log('   - {{CANCEL_CALLBACK}} - Cancel button action');
console.log('\n✅ All examples are ready to use in your NPM package!'); 