import { RedirectFirewall } from '../core/firewall';
import { RedirectFirewallConfig } from '../types';

describe('RedirectFirewall', () => {
  let firewall: RedirectFirewall;
  const allowedDomains = ['example.com', 'trusted-site.org', 'api.myapp.com'];

  beforeEach(() => {
    firewall = new RedirectFirewall({ allowedDomains });
  });

  describe('basic validation', () => {
    it('should allow whitelisted domains', () => {
      const result = firewall.validateRedirect('https://example.com/dashboard');
      expect(result.allowed).toBe(true);
    });

    it('should block non-whitelisted domains', () => {
      const result = firewall.validateRedirect('https://malicious-site.com/steal-data');
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('malicious-site.com not allowed');
    });

    it('should handle invalid URLs', () => {
      const result = firewall.validateRedirect('');
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Invalid URL provided');
    });
  });

  describe('subdomain handling', () => {
    it('should not allow subdomains by default', () => {
      const result = firewall.validateRedirect('https://sub.example.com/page');
      expect(result.allowed).toBe(false);
    });

    it('should allow subdomains when configured', () => {
      const subdomainFirewall = new RedirectFirewall({
        allowedDomains: ['example.com'],
        allowedSubdomains: true
      });
      
      const result = subdomainFirewall.validateRedirect('https://sub.example.com/page');
      expect(result.allowed).toBe(true);
    });
  });

  describe('localhost handling', () => {
    it('should not allow localhost by default', () => {
      const result = firewall.validateRedirect('http://localhost:3000');
      expect(result.allowed).toBe(false);
    });

    it('should allow localhost when configured', () => {
      const localhostFirewall = new RedirectFirewall({
        allowedDomains: ['example.com'],
        allowLocalhost: true
      });
      
      const result = localhostFirewall.validateRedirect('http://localhost:3000');
      expect(result.allowed).toBe(true);
    });

    it('should handle various localhost formats', () => {
      const localhostFirewall = new RedirectFirewall({
        allowedDomains: ['example.com'],
        allowLocalhost: true
      });
      
      expect(localhostFirewall.validateRedirect('http://127.0.0.1:3000').allowed).toBe(true);
      expect(localhostFirewall.validateRedirect('http://192.168.1.1:3000').allowed).toBe(true);
    });
  });

  describe('relative URLs', () => {
    it('should allow relative URLs by default', () => {
      const result = firewall.validateRedirect('/dashboard');
      expect(result.allowed).toBe(true);
    });

    it('should block relative URLs when configured', () => {
      const strictFirewall = new RedirectFirewall({
        allowedDomains: ['example.com'],
        allowRelativeUrls: false
      });
      
      const result = strictFirewall.validateRedirect('/dashboard');
      expect(result.allowed).toBe(false);
    });
  });

  describe('custom validation', () => {
    it('should use custom validator when provided', () => {
      const customFirewall = new RedirectFirewall({
        allowedDomains: ['example.com', 'secure.example.com'],
        customValidator: (url) => url.includes('secure')
      });
      
      expect(customFirewall.validateRedirect('https://secure.example.com').allowed).toBe(true);
      expect(customFirewall.validateRedirect('https://insecure.example.com').allowed).toBe(false);
    });
  });

  describe('violation logging', () => {
    it('should log violations', () => {
      firewall.validateRedirect('https://malicious-site.com');
      const violations = firewall.getViolations();
      
      expect(violations).toHaveLength(1);
      expect(violations[0].originalUrl).toBe('https://malicious-site.com');
      expect(violations[0].reason).toContain('malicious-site.com not in whitelist');
    });

    it('should clear violations', () => {
      firewall.validateRedirect('https://malicious-site.com');
      expect(firewall.getViolations()).toHaveLength(1);
      
      firewall.clearViolations();
      expect(firewall.getViolations()).toHaveLength(0);
    });
  });

  describe('configuration updates', () => {
    it('should update configuration', () => {
      firewall.updateConfig({ allowLocalhost: true });
      const result = firewall.validateRedirect('http://localhost:3000');
      expect(result.allowed).toBe(true);
    });

    it('should return allowed domains', () => {
      const domains = firewall.getAllowedDomains();
      expect(domains).toEqual(allowedDomains);
    });
  });
}); 