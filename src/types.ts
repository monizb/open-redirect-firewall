export interface RedirectFirewallConfig {
  allowedDomains: string[];
  allowedSubdomains?: boolean;
  allowLocalhost?: boolean;
  allowRelativeUrls?: boolean;
  strictMode?: boolean;
  logViolations?: boolean;
  customValidator?: (url: string) => boolean;
}

export interface RedirectResult {
  allowed: boolean;
  reason?: string;
  sanitizedUrl?: string;
}

export interface FirewallViolation {
  timestamp: Date;
  originalUrl: string;
  reason: string;
  userAgent?: string;
  ip?: string;
}

export interface ExpressRedirectOptions {
  statusCode?: number;
  headers?: Record<string, string>;
}

export interface CustomInterstitialTheme {
  // Colors
  primaryColor?: string;        // Main brand color (default: #007bff)
  secondaryColor?: string;      // Secondary color (default: #6c757d)
  successColor?: string;        // Success/confirm color (default: #28a745)
  warningColor?: string;        // Warning color (default: #ffc107)
  dangerColor?: string;         // Danger/cancel color (default: #dc3545)
  backgroundColor?: string;     // Background color (default: #f8f9fa)
  surfaceColor?: string;        // Surface/card color (default: #ffffff)
  textColor?: string;           // Text color (default: #212529)
  borderColor?: string;         // Border color (default: #dee2e6)
  
  // Typography
  fontFamily?: string;          // Font family (default: system fonts)
  fontSize?: string;            // Base font size (default: 16px)
  headingFontSize?: string;     // Heading font size (default: 24px)
  
  // Spacing
  padding?: string;             // Padding (default: 20px)
  borderRadius?: string;        // Border radius (default: 8px)
  spacing?: string;             // General spacing (default: 16px)
  
  // Shadows
  boxShadow?: string;           // Box shadow (default: 0 4px 6px rgba(0,0,0,0.1))
  
  // Animation
  transitionDuration?: string;  // Transition duration (default: 0.3s)
}

export interface CustomInterstitialContent {
  // Required content
  title: string;                // Main title (e.g., "Security Check Required")
  description: string;          // Description text
  urlDisplay: string;           // How to display the URL (e.g., "You are about to visit:")
  
  // Optional content
  warningText?: string;         // Warning message
  confirmButtonText?: string;   // Confirm button text (default: "Continue")
  cancelButtonText?: string;    // Cancel button text (default: "Cancel")
  footerText?: string;          // Footer text (e.g., "If you're unsure, it's safer to stay on this site.")
  
  // Custom HTML (overrides other content if provided)
  customHTML?: string;          // Complete custom HTML template
}

export interface CustomInterstitialConfig {
  theme?: CustomInterstitialTheme;
  content?: CustomInterstitialContent;
  type?: 'popup' | 'fullpage';  // Interstitial type
}

export interface BrowserExtensionConfig {
  enabled: boolean;
  showNotifications: boolean;
  logToConsole: boolean;
  showInterstitial?: boolean;
  onInterstitial?: (url: string, callback: () => void) => void;
  trustAllDomains?: boolean; // Trust all domains but still show interstitial
  fullPageInterstitial?: boolean; // Show full page instead of popup
  onFullPageInterstitial?: (url: string, callback: () => void) => void;
  customInterstitial?: CustomInterstitialConfig; // Custom interstitial configuration
} 