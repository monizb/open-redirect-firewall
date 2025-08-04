import { useState, useCallback, useEffect } from 'react';
import { RedirectFirewall } from '../core/firewall';
import { RedirectFirewallConfig, RedirectResult } from '../types';

export interface UseRedirectFirewallOptions extends RedirectFirewallConfig {
  onViolation?: (result: RedirectResult) => void;
  autoValidate?: boolean;
}

export function useRedirectFirewall(options: UseRedirectFirewallOptions) {
  const [firewall] = useState(() => new RedirectFirewall(options));
  const [lastResult, setLastResult] = useState<RedirectResult | null>(null);

  const validateRedirect = useCallback((url: string): RedirectResult => {
    const result = firewall.validateRedirect(url);
    setLastResult(result);
    
    if (!result.allowed && options.onViolation) {
      options.onViolation(result);
    }
    
    return result;
  }, [firewall, options]);

  const safeRedirect = useCallback((url: string, fallbackUrl?: string) => {
    const result = validateRedirect(url);
    
    if (result.allowed) {
      window.location.href = result.sanitizedUrl || url;
    } else if (fallbackUrl) {
      window.location.href = fallbackUrl;
    } else {
      console.error('Redirect blocked:', result.reason);
    }
  }, [validateRedirect]);

  const safeNavigate = useCallback((url: string, fallbackUrl?: string) => {
    const result = validateRedirect(url);
    
    if (result.allowed) {
      window.history.pushState({}, '', result.sanitizedUrl || url);
    } else if (fallbackUrl) {
      window.history.pushState({}, '', fallbackUrl);
    } else {
      console.error('Navigation blocked:', result.reason);
    }
  }, [validateRedirect]);

  return {
    validateRedirect,
    safeRedirect,
    safeNavigate,
    lastResult,
    firewall
  };
}

export function useRedirectProtection(
  options: UseRedirectFirewallOptions,
  dependencies: any[] = []
) {
  const { validateRedirect, lastResult } = useRedirectFirewall(options);

  useEffect(() => {
    if (!options.autoValidate) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const currentUrl = window.location.href;
      const result = validateRedirect(currentUrl);
      
      if (!result.allowed) {
        event.preventDefault();
        event.returnValue = 'Navigation blocked by security policy';
        return 'Navigation blocked by security policy';
      }
    };

    const handlePopState = (event: PopStateEvent) => {
      const currentUrl = window.location.href;
      const result = validateRedirect(currentUrl);
      
      if (!result.allowed) {
        window.history.back();
        if (options.onViolation) {
          options.onViolation(result);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [validateRedirect, options, ...dependencies]);

  return { lastResult };
} 