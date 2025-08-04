const { createBrowserProtector } = require('open-redirect-firewall');

console.log('=== Comprehensive Custom Interstitial Demo ===\n');

// Demo 1: Dark Theme with Custom Branding
console.log('1. Dark Theme with Custom Branding:');
const darkThemeProtector = createBrowserProtector({
  allowedDomains: ['example.com', 'trusted-site.org']
}, {
  showInterstitial: true,
  customInterstitial: {
    theme: {
      primaryColor: '#00d4ff',      // Cyan accent
      secondaryColor: '#6c757d',
      successColor: '#00ff88',
      backgroundColor: '#1a1a1a',   // Dark background
      surfaceColor: '#2d2d2d',      // Dark surface
      textColor: '#ffffff',
      borderColor: '#404040',
      borderRadius: '16px',
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      fontSize: '14px',
      headingFontSize: '24px',
      boxShadow: '0 8px 32px rgba(0, 212, 255, 0.3)',
      padding: '32px'
    },
    content: {
      title: 'External Link Detected',
      description: 'You are about to navigate to an external website.',
      urlDisplay: 'Destination URL:',
      warningText: 'This site is not under our control and may have different security policies.',
      confirmButtonText: '🚀 Continue to External Site',
      cancelButtonText: '🔒 Stay on This Site',
      footerText: 'For security concerns, contact our support team.'
    },
    type: 'fullpage'
  }
});

// Demo 2: Minimalist Corporate Theme
console.log('\n2. Minimalist Corporate Theme:');
const corporateProtector = createBrowserProtector({
  allowedDomains: ['company.com', 'partner.com']
}, {
  showInterstitial: true,
  customInterstitial: {
    theme: {
      primaryColor: '#2563eb',      // Blue
      secondaryColor: '#64748b',
      successColor: '#059669',
      backgroundColor: '#ffffff',
      surfaceColor: '#ffffff',
      textColor: '#1e293b',
      borderColor: '#e2e8f0',
      borderRadius: '8px',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: '14px',
      headingFontSize: '18px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      padding: '24px',
      spacing: '16px'
    },
    content: {
      title: 'External Link Notice',
      description: 'You are leaving our secure corporate network.',
      urlDisplay: 'External destination:',
      warningText: 'This external website is not under our control.',
      confirmButtonText: 'Continue',
      cancelButtonText: 'Cancel',
      footerText: 'For questions, contact IT support at support@company.com'
    },
    type: 'popup'
  }
});

// Demo 3: Custom HTML with Gradient Background
console.log('\n3. Custom HTML with Gradient Background:');
const gradientProtector = createBrowserProtector({
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
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7);
          background-size: 400% 400%;
          animation: gradientShift 3s ease infinite;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          font-family: 'Arial', sans-serif;
        ">
          <style>
            @keyframes gradientShift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          </style>
          
          <div style="
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            max-width: 500px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            border: 1px solid rgba(255, 255, 255, 0.2);
          ">
            <div style="
              width: 80px;
              height: 80px;
              background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
              border-radius: 50%;
              margin: 0 auto 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 40px;
              box-shadow: 0 8px 16px rgba(0,0,0,0.2);
            ">⚠️</div>
            
            <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 28px;">External Link Warning</h2>
            
            <p style="color: #7f8c8d; margin-bottom: 20px; line-height: 1.6;">
              You're about to visit an external website that's not part of our network.
            </p>
            
            <div style="
              background: #f8f9fa;
              padding: 15px;
              border-radius: 10px;
              margin: 20px 0;
              font-family: 'Courier New', monospace;
              word-break: break-all;
              border: 2px solid #e9ecef;
              font-size: 12px;
            ">
              {{URL}}
            </div>
            
            <div style="margin-top: 30px;">
              <button onclick="{{CONFIRM_CALLBACK}}" style="
                background: linear-gradient(45deg, #4ecdc4, #44a08d);
                color: white;
                border: none;
                padding: 15px 35px;
                border-radius: 25px;
                margin-right: 15px;
                cursor: pointer;
                font-weight: bold;
                font-size: 16px;
                box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
                transition: all 0.3s ease;
              " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">Continue</button>
              
              <button onclick="{{CANCEL_CALLBACK}}" style="
                background: linear-gradient(45deg, #ff6b6b, #ee5a52);
                color: white;
                border: none;
                padding: 15px 35px;
                border-radius: 25px;
                cursor: pointer;
                font-weight: bold;
                font-size: 16px;
                box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
                transition: all 0.3s ease;
              " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">Cancel</button>
            </div>
          </div>
        </div>
      `
    }
  }
});

// Demo 4: Trust All Domains with Playful Theme
console.log('\n4. Trust All Domains with Playful Theme:');
const playfulProtector = createBrowserProtector({
  allowedDomains: ['example.com']
}, {
  trustAllDomains: true,           // Trust all domains but show interstitial
  showInterstitial: true,
  customInterstitial: {
    theme: {
      primaryColor: '#ff6b9d',     // Pink
      secondaryColor: '#feca57',   // Yellow
      successColor: '#48dbfb',     // Light blue
      backgroundColor: '#ff9ff3',  // Light pink
      surfaceColor: '#ffffff',
      textColor: '#2c3e50',
      borderRadius: '25px',
      fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
      fontSize: '18px',
      headingFontSize: '32px',
      boxShadow: '0 10px 30px rgba(255, 107, 157, 0.3)',
      padding: '40px'
    },
    content: {
      title: 'Link Confirmation Time! 🎉',
      description: 'Hey there! Just making sure you want to visit this link.',
      urlDisplay: 'You\'re about to visit:',
      warningText: 'Remember, this is an external site! 🌐',
      confirmButtonText: 'Yes, let\'s go! 🚀',
      cancelButtonText: 'Nah, I\'ll stay here 😊',
      footerText: 'Thanks for being awesome! 💖'
    },
    type: 'fullpage'
  }
});

// Demo 5: Professional Security Theme
console.log('\n5. Professional Security Theme:');
const securityProtector = createBrowserProtector({
  allowedDomains: ['secure.example.com', 'trusted-partner.com']
}, {
  showInterstitial: true,
  customInterstitial: {
    theme: {
      primaryColor: '#dc2626',     // Red
      secondaryColor: '#6b7280',
      successColor: '#059669',
      backgroundColor: '#fef2f2',  // Light red background
      surfaceColor: '#ffffff',
      textColor: '#1f2937',
      borderColor: '#fecaca',
      borderRadius: '12px',
      fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: '16px',
      headingFontSize: '24px',
      boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.1)',
      padding: '32px'
    },
    content: {
      title: 'Security Alert',
      description: 'You are attempting to access an external website.',
      urlDisplay: 'Target URL:',
      warningText: 'This external site is not verified by our security team.',
      confirmButtonText: 'Proceed (at your own risk)',
      cancelButtonText: 'Cancel and stay secure',
      footerText: 'For security assistance, contact security@company.com'
    },
    type: 'popup'
  }
});

console.log('\n=== Demo Summary ===');
console.log('✅ Dark Theme with Custom Branding - Cyberpunk style');
console.log('✅ Minimalist Corporate Theme - Clean and professional');
console.log('✅ Custom HTML with Gradient Background - Animated gradient');
console.log('✅ Trust All Domains with Playful Theme - Fun and friendly');
console.log('✅ Professional Security Theme - Security-focused design');
console.log('\n=== Key Features Demonstrated ===');
console.log('🎨 Custom color schemes and themes');
console.log('📝 Customizable content and messaging');
console.log('🔧 Popup vs full-page layouts');
console.log('🎭 Custom HTML templates with animations');
console.log('🛡️ Trust all domains with custom styling');
console.log('📱 Responsive design considerations');
console.log('🎯 Professional vs playful branding options');
console.log('\n=== Ready for Production Use ===');
console.log('All examples are production-ready and can be used immediately!'); 