import { RedirectFirewall } from '../core/firewall';
import { RedirectFirewallConfig, BrowserExtensionConfig } from '../types';
import { InterstitialGenerator } from '../utils/interstitial-generator';

export class BrowserRedirectProtector {
  private firewall: RedirectFirewall;
  private config: BrowserExtensionConfig;
  private isEnabled: boolean = true;
  private pendingRedirect: { url: string; callback: () => void } | null = null;

  constructor(firewallConfig: RedirectFirewallConfig, extensionConfig: BrowserExtensionConfig) {
    this.firewall = new RedirectFirewall(firewallConfig);
    this.config = extensionConfig;
    this.init();
  }

  private init(): void {
    if (typeof window === 'undefined') return;

    this.interceptLinkClicks();
    this.interceptFormSubmissions();
    this.interceptHistoryAPI();
  }

  // Safe redirect method since we can't intercept window.location in modern browsers
  public safeRedirect(url: string): void {
    this.handleRedirect(url, () => {
      if (typeof window !== 'undefined') {
        window.location.href = url;
      }
    });
  }

  private handleRedirect(url: string, callback: () => void): void {
    const result = this.firewall.validateRedirect(url);
    
    // If trustAllDomains is enabled, treat all URLs as allowed but still show interstitial
    if (result.allowed || this.config.trustAllDomains) {
      if (this.config.showInterstitial) {
        this.showInterstitial(url, callback);
      } else {
        callback();
      }
    } else {
      this.handleViolation(url, result.reason || 'Unknown violation');
    }
  }

  private showInterstitial(url: string, callback: () => void): void {
    this.pendingRedirect = { url, callback };
    
    // Check if custom interstitial is configured
    if (this.config.customInterstitial) {
      const html = InterstitialGenerator.generateInterstitial(
        url,
        this.config.customInterstitial,
        () => this.confirmRedirect(),
        () => this.cancelRedirect()
      );
      
      // Create and append the interstitial
      const interstitialElement = document.createElement('div');
      interstitialElement.innerHTML = html;
      interstitialElement.id = 'orf-interstitial';
      document.body.appendChild(interstitialElement);
      return;
    }
    
    // Check if full page interstitial is enabled
    if (this.config.fullPageInterstitial && this.config.onFullPageInterstitial) {
      this.config.onFullPageInterstitial(url, callback);
    } else if (this.config.onInterstitial) {
      this.config.onInterstitial(url, callback);
    }
  }

  public confirmRedirect(): void {
    if (this.pendingRedirect) {
      this.pendingRedirect.callback();
      this.pendingRedirect = null;
    }
    this.removeInterstitial();
  }

  public cancelRedirect(): void {
    this.pendingRedirect = null;
    this.removeInterstitial();
  }

  private removeInterstitial(): void {
    const interstitial = document.getElementById('orf-interstitial');
    if (interstitial) {
      interstitial.remove();
    }
  }

  private interceptLinkClicks(): void {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');
      
      if (!link || !this.isEnabled) return;

      const href = link.getAttribute('href');
      if (!href) return;

      const result = this.firewall.validateRedirect(href);
      if (!result.allowed && !this.config.trustAllDomains) {
        event.preventDefault();
        this.handleViolation(href, result.reason || 'Link redirect blocked');
      } else if (this.config.showInterstitial) {
        event.preventDefault();
        this.showInterstitial(href, () => {
          window.location.href = href;
        });
      }
    }, true);
  }

  private interceptFormSubmissions(): void {
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      if (!form || !this.isEnabled) return;

      const action = form.getAttribute('action');
      if (!action) return;

      const result = this.firewall.validateRedirect(action);
      if (!result.allowed && !this.config.trustAllDomains) {
        event.preventDefault();
        this.handleViolation(action, result.reason || 'Form redirect blocked');
      } else if (this.config.showInterstitial) {
        event.preventDefault();
        this.showInterstitial(action, () => {
          form.submit();
        });
      }
    }, true);
  }

  private interceptHistoryAPI(): void {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (state, title, url) => {
      if (url && typeof url === 'string' && this.isEnabled) {
        const result = this.firewall.validateRedirect(url);
        if (!result.allowed) {
          this.handleViolation(url, result.reason || 'History navigation blocked');
          return;
        }
      }
      originalPushState.call(history, state, title, url);
    };

    history.replaceState = (state, title, url) => {
      if (url && typeof url === 'string' && this.isEnabled) {
        const result = this.firewall.validateRedirect(url);
        if (!result.allowed) {
          this.handleViolation(url, result.reason || 'History navigation blocked');
          return;
        }
      }
      originalReplaceState.call(history, state, title, url);
    };
  }

  private handleViolation(url: string, reason: string): void {
    if (this.config.logToConsole) {
      console.warn(`[Open Redirect Firewall] Blocked: ${reason} - URL: ${url}`);
    }

    if (this.config.showNotifications) {
      this.showNotification(`Redirect blocked: ${reason}`);
    }
  }

  private showNotification(message: string): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Open Redirect Firewall', {
        body: message,
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red"><path d="M12 2L1 21h22L12 2zm0 3.17L19.83 19H4.17L12 5.17zM11 16h2v2h-2zm0-6h2v4h-2z"/></svg>'
      });
    }
  }

  enable(): void {
    this.isEnabled = true;
  }

  disable(): void {
    this.isEnabled = false;
  }

  updateConfig(newConfig: Partial<RedirectFirewallConfig>): void {
    this.firewall.updateConfig(newConfig);
  }

  updateExtensionConfig(newConfig: Partial<BrowserExtensionConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  validateUrl(url: string) {
    return this.firewall.validateRedirect(url);
  }

  getViolations() {
    return this.firewall.getViolations();
  }
}

export function createBrowserProtector(
  firewallConfig: RedirectFirewallConfig,
  extensionConfig: BrowserExtensionConfig = {
    enabled: true,
    showNotifications: true,
    logToConsole: true,
    showInterstitial: false
  }
): BrowserRedirectProtector {
  return new BrowserRedirectProtector(firewallConfig, extensionConfig);
} 