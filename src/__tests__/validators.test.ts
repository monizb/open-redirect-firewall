import {
  isValidUrl,
  extractDomain,
  isSubdomain,
  isLocalhost,
  isPrivateIP,
  sanitizeUrl,
  normalizeDomain,
  validateDomainList,
  isValidDomain,
  createDomainMatcher
} from '../utils/validators';

describe('URL Validators', () => {
  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('ftp://files.example.com')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('http://')).toBe(false);
    });
  });

  describe('extractDomain', () => {
    it('should extract domains from URLs', () => {
      expect(extractDomain('https://example.com/path')).toBe('example.com');
      expect(extractDomain('http://sub.example.com')).toBe('sub.example.com');
      expect(extractDomain('https://api.example.com:8080')).toBe('api.example.com');
    });

    it('should handle invalid URLs', () => {
      expect(extractDomain('not-a-url')).toBe(null);
      expect(extractDomain('')).toBe(null);
    });
  });

  describe('isSubdomain', () => {
    it('should identify subdomains', () => {
      expect(isSubdomain('sub.example.com', 'example.com')).toBe(true);
      expect(isSubdomain('api.example.com', 'example.com')).toBe(true);
      expect(isSubdomain('example.com', 'example.com')).toBe(false);
      expect(isSubdomain('malicious.com', 'example.com')).toBe(false);
    });

    it('should be case insensitive', () => {
      expect(isSubdomain('SUB.example.com', 'EXAMPLE.com')).toBe(true);
    });
  });

  describe('isLocalhost', () => {
    it('should identify localhost addresses', () => {
      expect(isLocalhost('localhost')).toBe(true);
      expect(isLocalhost('127.0.0.1')).toBe(true);
      expect(isLocalhost('192.168.1.1')).toBe(true);
      expect(isLocalhost('10.0.0.1')).toBe(true);
      expect(isLocalhost('172.16.0.1')).toBe(true);
    });

    it('should reject non-localhost addresses', () => {
      expect(isLocalhost('example.com')).toBe(false);
      expect(isLocalhost('8.8.8.8')).toBe(false);
    });
  });

  describe('isPrivateIP', () => {
    it('should identify private IP addresses', () => {
      expect(isPrivateIP('127.0.0.1')).toBe(true);
      expect(isPrivateIP('192.168.1.1')).toBe(true);
      expect(isPrivateIP('10.0.0.1')).toBe(true);
      expect(isPrivateIP('172.16.0.1')).toBe(true);
      expect(isPrivateIP('localhost')).toBe(true);
    });

    it('should reject public IP addresses', () => {
      expect(isPrivateIP('8.8.8.8')).toBe(false);
      expect(isPrivateIP('1.1.1.1')).toBe(false);
    });
  });

  describe('sanitizeUrl', () => {
    it('should sanitize URLs', () => {
      expect(sanitizeUrl('https://example.com/path?param=value#fragment'))
        .toBe('https://example.com/path?param=value');
    });

    it('should preserve essential parts', () => {
      const sanitized = sanitizeUrl('https://example.com/path?param=value#fragment');
      expect(sanitized).toContain('https://');
      expect(sanitized).toContain('example.com');
      expect(sanitized).toContain('/path');
      expect(sanitized).toContain('param=value');
    });
  });

  describe('normalizeDomain', () => {
    it('should normalize domains', () => {
      expect(normalizeDomain('EXAMPLE.COM')).toBe('example.com');
      expect(normalizeDomain('www.example.com')).toBe('example.com');
      expect(normalizeDomain('WWW.EXAMPLE.COM')).toBe('example.com');
    });
  });

  describe('validateDomainList', () => {
    it('should separate valid and invalid domains', () => {
      const domains = ['example.com', 'invalid-domain', 'trusted.org', 'not-a-domain'];
      const result = validateDomainList(domains);
      
      expect(result.valid).toEqual(['example.com', 'trusted.org']);
      expect(result.invalid).toEqual(['invalid-domain', 'not-a-domain']);
    });
  });

  describe('isValidDomain', () => {
    it('should validate correct domains', () => {
      expect(isValidDomain('example.com')).toBe(true);
      expect(isValidDomain('sub.example.com')).toBe(true);
      expect(isValidDomain('example-123.com')).toBe(true);
    });

    it('should reject invalid domains', () => {
      expect(isValidDomain('')).toBe(false);
      expect(isValidDomain('not-a-domain')).toBe(false);
      expect(isValidDomain('.example.com')).toBe(false);
      expect(isValidDomain('example..com')).toBe(false);
    });
  });

  describe('createDomainMatcher', () => {
    it('should create a working domain matcher', () => {
      const allowedDomains = ['example.com', 'trusted.org'];
      const matcher = createDomainMatcher(allowedDomains);
      
      expect(matcher('example.com')).toBe(true);
      expect(matcher('trusted.org')).toBe(true);
      expect(matcher('malicious.com')).toBe(false);
    });

    it('should handle subdomains when enabled', () => {
      const allowedDomains = ['example.com'];
      const matcher = createDomainMatcher(allowedDomains, true);
      
      expect(matcher('example.com')).toBe(true);
      expect(matcher('sub.example.com')).toBe(true);
      expect(matcher('api.example.com')).toBe(true);
      expect(matcher('malicious.com')).toBe(false);
    });

    it('should be case insensitive', () => {
      const allowedDomains = ['EXAMPLE.COM'];
      const matcher = createDomainMatcher(allowedDomains);
      
      expect(matcher('example.com')).toBe(true);
      expect(matcher('EXAMPLE.COM')).toBe(true);
    });
  });
}); 