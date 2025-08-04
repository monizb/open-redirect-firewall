// Core exports only (no React dependencies)
export { RedirectFirewall } from './core/firewall';
export type { 
  RedirectFirewallConfig, 
  RedirectResult, 
  FirewallViolation,
  ExpressRedirectOptions,
  BrowserExtensionConfig 
} from './types';

// Express middleware
export { 
  createRedirectFirewallMiddleware, 
  createValidationMiddleware 
} from './middleware/express';
export type { ExpressFirewallOptions } from './middleware/express';

// Browser extension
export { 
  BrowserRedirectProtector, 
  createBrowserProtector 
} from './browser/extension';

// Utilities
export * from './utils/validators';

// Default configuration helper
export function createDefaultConfig(allowedDomains: string[]) {
  return {
    allowedDomains,
    allowedSubdomains: false,
    allowLocalhost: false,
    allowRelativeUrls: true,
    strictMode: false,
    logViolations: true
  };
} 