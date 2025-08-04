import URLParse from 'url-parse';
import { RedirectFirewallConfig, RedirectResult, FirewallViolation } from '../types';

export class RedirectFirewall {
  private config: RedirectFirewallConfig;
  private violations: FirewallViolation[] = [];

  constructor(config: RedirectFirewallConfig) {
    this.config = {
      allowedSubdomains: false,
      allowLocalhost: false,
      allowRelativeUrls: true,
      strictMode: false,
      logViolations: true,
      ...config
    };
  }

  validateRedirect(url: string): RedirectResult {
    if (!url || typeof url !== 'string') {
      return this.createResult(false, 'Invalid URL provided');
    }

    const parsedUrl = new URLParse(url);
    
    if (this.config.customValidator && !this.config.customValidator(url)) {
      return this.createResult(false, 'Failed custom validation');
    }

    if (this.isRelativeUrl(parsedUrl)) {
      return this.config.allowRelativeUrls 
        ? this.createResult(true)
        : this.createResult(false, 'Relative URLs not allowed');
    }

    if (this.isLocalhost(parsedUrl)) {
      return this.config.allowLocalhost 
        ? this.createResult(true)
        : this.createResult(false, 'Localhost not allowed');
    }

    const domain = parsedUrl.hostname;
    if (!domain) {
      return this.createResult(false, 'No domain found in URL');
    }

    const isAllowed = this.isDomainAllowed(domain);
    if (!isAllowed) {
      this.logViolation(url, `Domain ${domain} not in whitelist`);
      return this.createResult(false, `Domain ${domain} not allowed`);
    }

    return this.createResult(true, undefined, this.sanitizeUrl(url));
  }

  private isRelativeUrl(parsedUrl: URLParse<any>): boolean {
    return !parsedUrl.protocol || parsedUrl.protocol === '';
  }

  private isLocalhost(parsedUrl: URLParse<any>): boolean {
    const hostname = parsedUrl.hostname.toLowerCase();
    return hostname === 'localhost' || 
           hostname === '127.0.0.1' || 
           hostname.startsWith('192.168.') ||
           hostname.startsWith('10.') ||
           hostname.startsWith('172.');
  }

  private isDomainAllowed(domain: string): boolean {
    const normalizedDomain = domain.toLowerCase();
    
    for (const allowedDomain of this.config.allowedDomains) {
      const normalizedAllowed = allowedDomain.toLowerCase();
      
      if (normalizedDomain === normalizedAllowed) {
        return true;
      }
      
      if (this.config.allowedSubdomains && normalizedDomain.endsWith('.' + normalizedAllowed)) {
        return true;
      }
    }
    
    return false;
  }

  private sanitizeUrl(url: string): string {
    if (this.config.strictMode) {
      const parsed = new URLParse(url);
      return `${parsed.protocol}//${parsed.hostname}${parsed.pathname}${parsed.query}`;
    }
    return url;
  }

  private createResult(allowed: boolean, reason?: string, sanitizedUrl?: string): RedirectResult {
    return {
      allowed,
      reason,
      sanitizedUrl: sanitizedUrl || (allowed ? undefined : undefined)
    };
  }

  private logViolation(originalUrl: string, reason: string): void {
    if (!this.config.logViolations) return;

    const violation: FirewallViolation = {
      timestamp: new Date(),
      originalUrl,
      reason
    };

    this.violations.push(violation);
    
    if (this.config.logViolations) {
      console.warn(`[Open Redirect Firewall] Violation: ${reason} - URL: ${originalUrl}`);
    }
  }

  getViolations(): FirewallViolation[] {
    return [...this.violations];
  }

  clearViolations(): void {
    this.violations = [];
  }

  updateConfig(newConfig: Partial<RedirectFirewallConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getAllowedDomains(): string[] {
    return [...this.config.allowedDomains];
  }
} 