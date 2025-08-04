import React, { useState } from 'react';
import { useRedirectFirewall } from '../src/react/hooks';

function LoginComponent() {
  const [redirectUrl, setRedirectUrl] = useState('');
  const [message, setMessage] = useState('');

  const { validateRedirect, safeRedirect } = useRedirectFirewall({
    allowedDomains: ['example.com', 'trusted-site.org', 'myapp.com'],
    allowedSubdomains: true,
    allowLocalhost: true,
    onViolation: (result) => {
      setMessage(`🚫 Redirect blocked: ${result.reason}`);
    }
  });

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setRedirectUrl(url);
    
    if (url) {
      const result = validateRedirect(url);
      if (result.allowed) {
        setMessage('✅ URL is safe');
      } else {
        setMessage(`⚠️ ${result.reason}`);
      }
    } else {
      setMessage('');
    }
  };

  const handleRedirect = () => {
    if (redirectUrl) {
      safeRedirect(redirectUrl, '/dashboard');
    }
  };

  const testUrls = [
    'https://example.com/dashboard',
    'https://malicious-site.com/steal-data',
    'https://trusted-site.org/profile',
    'https://phishing-site.com/fake-login'
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Open Redirect Firewall - React Example</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="redirectUrl">Redirect URL:</label>
        <input
          id="redirectUrl"
          type="text"
          value={redirectUrl}
          onChange={handleUrlChange}
          placeholder="Enter a URL to test"
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      {message && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px',
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}

      <button 
        onClick={handleRedirect}
        disabled={!redirectUrl}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: redirectUrl ? 'pointer' : 'not-allowed',
          opacity: redirectUrl ? 1 : 0.6
        }}
      >
        Safe Redirect
      </button>

      <div style={{ marginTop: '30px' }}>
        <h3>Test URLs:</h3>
        <ul>
          {testUrls.map((url, index) => (
            <li key={index}>
              <button
                onClick={() => setRedirectUrl(url)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#007bff', 
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                {url}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h4>How it works:</h4>
        <ul>
          <li>Enter a URL in the input field above</li>
          <li>The firewall validates it against the whitelist</li>
          <li>Safe URLs show a green checkmark</li>
          <li>Blocked URLs show a warning message</li>
          <li>Click "Safe Redirect" to navigate (only works for allowed URLs)</li>
        </ul>
      </div>
    </div>
  );
}

export default LoginComponent; 