/**
 * ============================================================================
 * SAIN International Logistics - Anti-Inspect & Client Security Shield
 * Prevents F12, Right-Click, DevTools, Source-Viewing, Scraping & Console Access
 * ============================================================================
 */

export function initializeSecurityShield(): void {
  if (typeof window === 'undefined') return;

  // 1. Disable Right-Click (Context Menu)
  window.addEventListener('contextmenu', (e: MouseEvent) => {
    e.preventDefault();
    return false;
  }, { capture: true });

  // 3. Block Developer Key Shortcuts (F12, Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+S, Ctrl+P)
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    const isCtrl = e.ctrlKey || e.metaKey;
    const isShift = e.shiftKey;
    const key = (e.key || '').toUpperCase();
    const code = e.keyCode || e.which;

    // F12 key
    if (key === 'F12' || code === 123) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+I (DevTools Inspect)
    if (isCtrl && isShift && (key === 'I' || code === 73)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+J (DevTools Console)
    if (isCtrl && isShift && (key === 'J' || code === 74)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+C (Element Inspector)
    if (isCtrl && isShift && (key === 'C' || code === 67)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+U (View Page Source)
    if (isCtrl && (key === 'U' || code === 85)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+S (Save Page HTML)
    if (isCtrl && (key === 'S' || code === 83)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+P (Print Page / PDF Scraping)
    if (isCtrl && (key === 'P' || code === 80)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, { capture: true });

  // 4. Disable Drag & Drop of Images & Content
  window.addEventListener('dragstart', (e: DragEvent) => {
    e.preventDefault();
    return false;
  }, { capture: true });

  // 5. Console Protection & Output Neutralization
  try {
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      const noop = () => {};
      const sensitiveMethods = ['log', 'debug', 'info', 'dir', 'table', 'trace'];
      sensitiveMethods.forEach((method) => {
        try {
          (window.console as any)[method] = noop;
        } catch {}
      });
    }
  } catch {}

  // 6. Active DevTools Detection & Anti-Tamper Routine
  let devToolsDetected = false;

  const triggerSecurityAlert = () => {
    if (devToolsDetected) return;
    devToolsDetected = true;
    try {
      window.console.clear();
    } catch {}
  };

  // Dimension Threshold Probe (detects docked DevTools window)
  const checkDimensions = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;
    if (widthThreshold || heightThreshold) {
      triggerSecurityAlert();
    } else {
      devToolsDetected = false;
    }
  };

  window.addEventListener('resize', checkDimensions);
  setInterval(checkDimensions, 1000);

  // Periodic Console Purge
  setInterval(() => {
    try {
      window.console.clear();
    } catch {}
  }, 3000);
}
