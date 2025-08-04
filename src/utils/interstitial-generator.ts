import { CustomInterstitialConfig, CustomInterstitialTheme, CustomInterstitialContent } from '../types';

export class InterstitialGenerator {
  private static defaultTheme: CustomInterstitialTheme = {
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    successColor: '#28a745',
    warningColor: '#ffc107',
    dangerColor: '#dc3545',
    backgroundColor: '#f8f9fa',
    surfaceColor: '#ffffff',
    textColor: '#212529',
    borderColor: '#dee2e6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: '16px',
    headingFontSize: '24px',
    padding: '20px',
    borderRadius: '8px',
    spacing: '16px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transitionDuration: '0.3s'
  };

  private static defaultContent: CustomInterstitialContent = {
    title: 'Security Check Required',
    description: 'For your security, please confirm that you want to visit this external website.',
    urlDisplay: 'You are about to visit:',
    warningText: 'This external site is not controlled by us and may have different security policies.',
    confirmButtonText: 'Continue to External Site',
    cancelButtonText: 'Stay on This Site',
    footerText: 'If you\'re unsure, it\'s safer to stay on this site.'
  };

  /**
   * Generate custom interstitial HTML
   */
  static generateInterstitial(
    url: string, 
    config: CustomInterstitialConfig,
    onConfirm: () => void,
    onCancel: () => void
  ): string {
    const theme = { ...this.defaultTheme, ...config.theme };
    const content = { ...this.defaultContent, ...config.content };
    const type = config.type || 'popup';

    // If custom HTML is provided, use it with URL and callback placeholders
    if (content.customHTML) {
      return this.processCustomHTML(content.customHTML, url, onConfirm, onCancel);
    }

    // Generate structured HTML based on type
    if (type === 'fullpage') {
      return this.generateFullPageInterstitial(url, theme, content, onConfirm, onCancel);
    } else {
      return this.generatePopupInterstitial(url, theme, content, onConfirm, onCancel);
    }
  }

  /**
   * Generate full page interstitial HTML
   */
  private static generateFullPageInterstitial(
    url: string,
    theme: CustomInterstitialTheme,
    content: CustomInterstitialContent,
    onConfirm: () => void,
    onCancel: () => void
  ): string {
    const styles = this.generateStyles(theme, 'fullpage');
    
    return `
      <div class="orf-fullpage-interstitial" style="${styles.container}">
        <div class="orf-content" style="${styles.content}">
          <h1 style="${styles.heading}">⚠️ ${content.title}</h1>
          
          ${content.warningText ? `
            <div class="orf-warning" style="${styles.warning}">
              <strong>Important:</strong> ${content.warningText}
            </div>
          ` : ''}
          
          <p style="${styles.text}">${content.description}</p>
          
          <div class="orf-url-display" style="${styles.urlDisplay}">
            <strong>${content.urlDisplay}</strong><br>
            <span style="${styles.url}">${url}</span>
          </div>
          
          <p style="${styles.text}">${content.warningText || ''}</p>
          
          <div class="orf-buttons" style="${styles.buttonContainer}">
            <button 
              class="orf-confirm-btn" 
              style="${styles.confirmButton}"
              onclick="window.orfConfirmCallback()"
            >
              ✅ ${content.confirmButtonText}
            </button>
            <button 
              class="orf-cancel-btn" 
              style="${styles.cancelButton}"
              onclick="window.orfCancelCallback()"
            >
              ❌ ${content.cancelButtonText}
            </button>
          </div>
          
          ${content.footerText ? `
            <div class="orf-footer" style="${styles.footer}">
              <p>${content.footerText}</p>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Generate popup interstitial HTML
   */
  private static generatePopupInterstitial(
    url: string,
    theme: CustomInterstitialTheme,
    content: CustomInterstitialContent,
    onConfirm: () => void,
    onCancel: () => void
  ): string {
    const styles = this.generateStyles(theme, 'popup');
    
    return `
      <div class="orf-popup-overlay" style="${styles.overlay}">
        <div class="orf-popup-content" style="${styles.popupContent}">
          <h2 style="${styles.heading}">⚠️ ${content.title}</h2>
          
          <p style="${styles.text}">${content.description}</p>
          
          <div class="orf-url-display" style="${styles.urlDisplay}">
            <strong>${content.urlDisplay}</strong><br>
            <span style="${styles.url}">${url}</span>
          </div>
          
          <p style="${styles.text}">Are you sure you want to continue?</p>
          
          <div class="orf-buttons" style="${styles.buttonContainer}">
            <button 
              class="orf-confirm-btn" 
              style="${styles.confirmButton}"
              onclick="window.orfConfirmCallback()"
            >
              ${content.confirmButtonText}
            </button>
            <button 
              class="orf-cancel-btn" 
              style="${styles.cancelButton}"
              onclick="window.orfCancelCallback()"
            >
              ${content.cancelButtonText}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Generate CSS styles based on theme
   */
  private static generateStyles(theme: CustomInterstitialTheme, type: 'popup' | 'fullpage'): Record<string, string> {
    const baseStyles = {
      fontFamily: theme.fontFamily || this.defaultTheme.fontFamily!,
      fontSize: theme.fontSize || this.defaultTheme.fontSize!,
      color: theme.textColor || this.defaultTheme.textColor!,
      transition: `all ${theme.transitionDuration || this.defaultTheme.transitionDuration!} ease`
    };

    if (type === 'fullpage') {
      return {
        container: `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: ${theme.backgroundColor || this.defaultTheme.backgroundColor};
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: ${baseStyles.fontFamily};
          font-size: ${baseStyles.fontSize};
          color: ${baseStyles.color};
          transition: ${baseStyles.transition};
        `,
        content: `
          background: ${theme.surfaceColor || this.defaultTheme.surfaceColor};
          padding: ${theme.padding || this.defaultTheme.padding};
          border-radius: ${theme.borderRadius || this.defaultTheme.borderRadius};
          box-shadow: ${theme.boxShadow || this.defaultTheme.boxShadow};
          max-width: 600px;
          text-align: center;
          border: 1px solid ${theme.borderColor || this.defaultTheme.borderColor};
        `,
        heading: `
          font-size: ${theme.headingFontSize || this.defaultTheme.headingFontSize};
          margin: 0 0 ${theme.spacing || this.defaultTheme.spacing} 0;
          color: ${theme.textColor || this.defaultTheme.textColor};
        `,
        text: `
          margin: ${theme.spacing || this.defaultTheme.spacing} 0;
          line-height: 1.6;
        `,
        warning: `
          background: ${theme.warningColor || this.defaultTheme.warningColor};
          color: #856404;
          padding: ${theme.spacing || this.defaultTheme.spacing};
          border-radius: ${theme.borderRadius || this.defaultTheme.borderRadius};
          margin: ${theme.spacing || this.defaultTheme.spacing} 0;
          border: 1px solid #ffeaa7;
        `,
        urlDisplay: `
          background: ${theme.backgroundColor || this.defaultTheme.backgroundColor};
          padding: ${theme.spacing || this.defaultTheme.spacing};
          border-radius: ${theme.borderRadius || this.defaultTheme.borderRadius};
          margin: ${theme.spacing || this.defaultTheme.spacing} 0;
          word-break: break-all;
          font-family: monospace;
          border: 1px solid ${theme.borderColor || this.defaultTheme.borderColor};
        `,
        url: `
          color: ${theme.primaryColor || this.defaultTheme.primaryColor};
          font-weight: bold;
        `,
        buttonContainer: `
          margin-top: ${theme.spacing || this.defaultTheme.spacing};
          display: flex;
          gap: ${theme.spacing || this.defaultTheme.spacing};
          justify-content: center;
          flex-wrap: wrap;
        `,
        confirmButton: `
          background: ${theme.successColor || this.defaultTheme.successColor};
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: ${theme.borderRadius || this.defaultTheme.borderRadius};
          cursor: pointer;
          font-size: ${theme.fontSize || this.defaultTheme.fontSize};
          font-weight: bold;
          transition: ${baseStyles.transition};
        `,
        cancelButton: `
          background: ${theme.secondaryColor || this.defaultTheme.secondaryColor};
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: ${theme.borderRadius || this.defaultTheme.borderRadius};
          cursor: pointer;
          font-size: ${theme.fontSize || this.defaultTheme.fontSize};
          font-weight: bold;
          transition: ${baseStyles.transition};
        `,
        footer: `
          margin-top: ${theme.spacing || this.defaultTheme.spacing};
          font-size: 14px;
          color: ${theme.secondaryColor || this.defaultTheme.secondaryColor};
        `
      };
    } else {
      return {
        overlay: `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          font-family: ${baseStyles.fontFamily};
          font-size: ${baseStyles.fontSize};
          color: ${baseStyles.color};
          transition: ${baseStyles.transition};
        `,
        popupContent: `
          background: ${theme.surfaceColor || this.defaultTheme.surfaceColor};
          padding: ${theme.padding || this.defaultTheme.padding};
          border-radius: ${theme.borderRadius || this.defaultTheme.borderRadius};
          max-width: 500px;
          text-align: center;
          box-shadow: ${theme.boxShadow || this.defaultTheme.boxShadow};
          border: 1px solid ${theme.borderColor || this.defaultTheme.borderColor};
        `,
        heading: `
          font-size: ${theme.headingFontSize || this.defaultTheme.headingFontSize};
          margin: 0 0 ${theme.spacing || this.defaultTheme.spacing} 0;
          color: ${theme.textColor || this.defaultTheme.textColor};
        `,
        text: `
          margin: ${theme.spacing || this.defaultTheme.spacing} 0;
          line-height: 1.6;
        `,
        urlDisplay: `
          background: ${theme.backgroundColor || this.defaultTheme.backgroundColor};
          padding: ${theme.spacing || this.defaultTheme.spacing};
          border-radius: ${theme.borderRadius || this.defaultTheme.borderRadius};
          margin: ${theme.spacing || this.defaultTheme.spacing} 0;
          word-break: break-all;
          font-family: monospace;
          border: 1px solid ${theme.borderColor || this.defaultTheme.borderColor};
        `,
        url: `
          color: ${theme.primaryColor || this.defaultTheme.primaryColor};
          font-weight: bold;
        `,
        buttonContainer: `
          margin-top: ${theme.spacing || this.defaultTheme.spacing};
          display: flex;
          gap: ${theme.spacing || this.defaultTheme.spacing};
          justify-content: center;
        `,
        confirmButton: `
          background: ${theme.primaryColor || this.defaultTheme.primaryColor};
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: ${theme.borderRadius || this.defaultTheme.borderRadius};
          cursor: pointer;
          font-size: ${theme.fontSize || this.defaultTheme.fontSize};
          font-weight: bold;
          transition: ${baseStyles.transition};
        `,
        cancelButton: `
          background: ${theme.secondaryColor || this.defaultTheme.secondaryColor};
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: ${theme.borderRadius || this.defaultTheme.borderRadius};
          cursor: pointer;
          font-size: ${theme.fontSize || this.defaultTheme.fontSize};
          font-weight: bold;
          transition: ${baseStyles.transition};
        `
      };
    }
  }

  /**
   * Process custom HTML template with placeholders
   */
  private static processCustomHTML(
    template: string, 
    url: string, 
    onConfirm: () => void, 
    onCancel: () => void
  ): string {
    // Set up global callbacks
    (window as any).orfConfirmCallback = onConfirm;
    (window as any).orfCancelCallback = onCancel;

    // Replace placeholders
    return template
      .replace(/\{\{URL\}\}/g, url)
      .replace(/\{\{CONFIRM_CALLBACK\}\}/g, 'window.orfConfirmCallback()')
      .replace(/\{\{CANCEL_CALLBACK\}\}/g, 'window.orfCancelCallback()');
  }
} 