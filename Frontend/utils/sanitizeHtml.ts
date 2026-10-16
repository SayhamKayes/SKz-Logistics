/**
 * Utility to safely sanitize and render rich HTML formatted with Word-like styles
 * (Bold, Italic, Underline, line breaks, etc.) for the footer overview paragraph.
 */
export function sanitizeRichHtml(html?: string | null): string {
  if (!html) return '';

  // In non-browser environments, return sanitized string
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Safe formatting tags allowed from Word-like editor
    const allowedTags = new Set([
      'B',
      'STRONG',
      'I',
      'EM',
      'U',
      'S',
      'STRIKE',
      'SPAN',
      'P',
      'BR',
      'SUB',
      'SUP',
      'MARK',
    ]);

    const sanitizeNode = (node: Node) => {
      const children = Array.from(node.childNodes);
      for (const child of children) {
        if (child.nodeType === Node.ELEMENT_NODE) {
          const el = child as HTMLElement;
          const tagName = el.tagName.toUpperCase();

          if (!allowedTags.has(tagName)) {
            // Remove unsafe tags completely
            node.removeChild(child);
            continue;
          }

          // Strip any dangerous attributes or event handlers
          const attrs = Array.from(el.attributes);
          for (const attr of attrs) {
            const attrName = attr.name.toLowerCase();
            // Disallow inline JS or event handlers
            if (attrName.startsWith('on') || attrName === 'style') {
              el.removeAttribute(attr.name);
            }
          }

          sanitizeNode(child);
        }
      }
    };

    sanitizeNode(doc.body);
    return doc.body.innerHTML;
  } catch {
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
