import { Request, Response, NextFunction } from 'express';
import { RedirectFirewall } from '../core/firewall';
import { RedirectFirewallConfig, ExpressRedirectOptions } from '../types';

export interface ExpressFirewallOptions extends RedirectFirewallConfig {
  redirectParam?: string;
  redirectHeader?: string;
  fallbackUrl?: string;
  redirectOptions?: ExpressRedirectOptions;
  showInterstitial?: boolean;
  onInterstitial?: (req: Request, res: Response, url: string) => void;
}

export function createRedirectFirewallMiddleware(options: ExpressFirewallOptions) {
  const firewall = new RedirectFirewall(options);
  
  return (req: Request, res: Response, next: NextFunction) => {
    const redirectParam = options.redirectParam || 'redirect';
    const redirectHeader = options.redirectHeader || 'x-redirect-url';
    
    const redirectUrl = req.query[redirectParam] as string || req.headers[redirectHeader] as string;
    
    if (!redirectUrl) {
      return next();
    }

    const result = firewall.validateRedirect(redirectUrl);
    
    if (!result.allowed) {
      if (options.fallbackUrl) {
        return res.redirect(options.fallbackUrl);
      }
      
      const statusCode = options.redirectOptions?.statusCode || 400;
      return res.status(statusCode).json({
        error: 'Invalid redirect URL',
        reason: result.reason,
        message: 'The requested redirect URL is not allowed by security policy'
      });
    }

    const finalUrl = result.sanitizedUrl || redirectUrl;
    
    // Check if interstitial is enabled
    if (options.showInterstitial && options.onInterstitial) {
      return options.onInterstitial(req, res, finalUrl);
    }
    
    const statusCode = options.redirectOptions?.statusCode || 302;
    const headers = options.redirectOptions?.headers || {};
    
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    res.redirect(statusCode, finalUrl);
  };
}

export function createValidationMiddleware(options: RedirectFirewallConfig) {
  const firewall = new RedirectFirewall(options);
  
  return (req: Request, res: Response, next: NextFunction) => {
    const redirectUrl = req.body.redirectUrl || req.query.redirectUrl;
    
    if (!redirectUrl) {
      return next();
    }

    const result = firewall.validateRedirect(redirectUrl);
    
    if (!result.allowed) {
      return res.status(400).json({
        error: 'Invalid redirect URL',
        reason: result.reason
      });
    }

    req.body.sanitizedRedirectUrl = result.sanitizedUrl || redirectUrl;
    next();
  };
} 