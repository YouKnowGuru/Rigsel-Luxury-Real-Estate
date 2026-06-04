/**
 * HTML Sanitization Module
 * Uses DOMPurify for robust XSS protection.
 * Falls back to escapeHtml for plain text contexts.
 */

import DOMPurify from "isomorphic-dompurify";

// DOMPurify configuration for rich text content (blogs, property descriptions)
const RICH_TEXT_CONFIG = {
  ALLOWED_TAGS: [
    "p", "br", "hr", "h1", "h2", "h3", "h4", "h5", "h6",
    "strong", "b", "em", "i", "u", "strike", "del", "s",
    "a", "img", "ul", "ol", "li", "blockquote", "code", "pre",
    "div", "span", "table", "thead", "tbody", "tr", "td", "th",
    "sup", "sub",
  ],
  ALLOWED_ATTR: [
    "href", "title", "target", "rel", "src", "alt", "width", "height",
    "class", "style", "colspan", "rowspan",
  ],
  ALLOW_DATA_ATTR: false,
  // Force all links to open in new tab with noopener
  HOOKS: {
    uponSanitizeAttribute: (node: Element, data: { attrName: string; attrValue: string }) => {
      if (data.attrName === "href" && node.tagName === "A") {
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "noopener noreferrer");
      }
    },
  },
  // Prevent javascript: and data: URLs
  ALLOWED_URI_REGEXP:
    /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|xxx):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
};

// DOMPurify configuration for email HTML (more restrictive)
const EMAIL_CONFIG = {
  ALLOWED_TAGS: ["p", "br", "strong", "b", "em", "i", "u", "a", "span", "div"],
  ALLOWED_ATTR: ["href", "title", "style"],
  ALLOW_DATA_ATTR: false,
};

/**
 * Sanitize HTML string for rich text display (blogs, property descriptions).
 * Uses DOMPurify with a generous but safe allowlist.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return DOMPurify.sanitize(html, RICH_TEXT_CONFIG);
}

/**
 * Sanitize HTML for email content (more restrictive).
 */
export function sanitizeEmailHtml(text: string): string {
  if (!text) return "";
  // First escape HTML entities, then allow basic formatting
  const escaped = escapeHtmlEntities(text);
  // Convert newlines to <br> for email formatting
  return escaped.replace(/\n/g, "<br>");
}

/**
 * Escape HTML entities for plain text contexts.
 * Use this when you need to display user input as plain text.
 */
export function escapeHtmlEntities(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/**
 * Strip all HTML tags, returning plain text only.
 * Useful for meta descriptions, previews, etc.
 */
export function stripHtml(html: string): string {
  if (!html) return "";
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
}

/**
 * Validate and sanitize a URL.
 * Returns empty string if URL is not safe.
 */
export function sanitizeUrl(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();

  // Allow http, https, mailto, tel protocols only
  if (
    lower.startsWith("http://") ||
    lower.startsWith("https://") ||
    lower.startsWith("mailto:") ||
    lower.startsWith("tel:")
  ) {
    return trimmed;
  }

  return "";
}
