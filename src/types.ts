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

export interface BrowserExtensionConfig {
  enabled: boolean;
  showNotifications: boolean;
  logToConsole: boolean;
  showInterstitial?: boolean;
  onInterstitial?: (url: string, callback: () => void) => void;
  trustAllDomains?: boolean; // Trust all domains but still show interstitial
  fullPageInterstitial?: boolean; // Show full page instead of popup
  onFullPageInterstitial?: (url: string, callback: () => void) => void;
} 