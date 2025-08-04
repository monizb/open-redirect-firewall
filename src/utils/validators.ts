import URLParse from 'url-parse';

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function extractDomain(url: string): string | null {
  try {
    const parsed = new URLParse(url);
    return parsed.hostname || null;
  } catch {
    return null;
  }
}

export function isSubdomain(domain: string, parentDomain: string): boolean {
  const normalizedDomain = domain.toLowerCase();
  const normalizedParent = parentDomain.toLowerCase();
  
  return normalizedDomain.endsWith('.' + normalizedParent);
}

export function isLocalhost(domain: string): boolean {
  const normalized = domain.toLowerCase();
  return normalized === 'localhost' || 
         normalized === '127.0.0.1' || 
         normalized.startsWith('192.168.') ||
         normalized.startsWith('10.') ||
         normalized.startsWith('172.');
}

export function isPrivateIP(domain: string): boolean {
  const normalized = domain.toLowerCase();
  return normalized.startsWith('192.168.') ||
         normalized.startsWith('10.') ||
         normalized.startsWith('172.') ||
         normalized === '127.0.0.1' ||
         normalized === 'localhost';
}

export function sanitizeUrl(url: string): string {
  const parsed = new URLParse(url);
  
  return `${parsed.protocol}//${parsed.hostname}${parsed.pathname}${parsed.query}`;
}

export function normalizeDomain(domain: string): string {
  return domain.toLowerCase().replace(/^www\./, '');
}

export function validateDomainList(domains: string[]): { valid: string[], invalid: string[] } {
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const domain of domains) {
    if (isValidDomain(domain)) {
      valid.push(normalizeDomain(domain));
    } else {
      invalid.push(domain);
    }
  }

  return { valid, invalid };
}

export function isValidDomain(domain: string): boolean {
  if (!domain || typeof domain !== 'string') return false;
  
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return domainRegex.test(domain) && domain.includes('.');
}

export function createDomainMatcher(allowedDomains: string[], allowSubdomains: boolean = false) {
  const normalizedDomains = allowedDomains.map(normalizeDomain);
  
  return (domain: string): boolean => {
    const normalizedDomain = normalizeDomain(domain);
    
    for (const allowed of normalizedDomains) {
      if (normalizedDomain === allowed) {
        return true;
      }
      
      if (allowSubdomains && isSubdomain(normalizedDomain, allowed)) {
        return true;
      }
    }
    
    return false;
  };
} 