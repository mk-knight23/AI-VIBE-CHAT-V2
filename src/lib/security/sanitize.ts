/**
 * Sanitization utilities for preventing XSS attacks
 */

/**
 * Escape HTML entities to prevent XSS
 * This is used when rendering user-generated content
 * @param content - The content to escape
 * @returns Escaped content safe for HTML rendering
 */
export function escapeHtml(content: string): string {
  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };

  return content.replace(/[&<>"'/]/g, (char) => htmlEntities[char] || char);
}

/**
 * Strip potentially dangerous HTML tags and attributes
 * while preserving safe formatting
 * @param content - The content to sanitize
 * @returns Sanitized content with dangerous HTML removed
 */
export function sanitizeHtml(content: string): string {
  // Remove script tags and their content
  let sanitized = content.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");

  // Remove dangerous event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, "");

  // Remove iframe, object, embed tags
  sanitized = sanitized.replace(/<(iframe|object|embed)[\s\S]*?>/gi, "");

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, "");

  // Remove data: protocol (except for safe images)
  sanitized = sanitized.replace(
    /data:(?!image\/(png|gif|jpeg|webp);base64)/gi,
    "",
  );

  return sanitized;
}

/**
 * Safely render content by escaping HTML
 * Svelte automatically escapes content in {} expressions,
 * but this provides explicit sanitization for extra safety
 * @param content - The content to safely render
 * @returns Escaped content
 */
export function safeText(content: string): string {
  return escapeHtml(content);
}

/**
 * Validate that content doesn't contain suspicious patterns
 * @param content - The content to validate
 * @returns true if content appears safe
 */
export function isContentSafe(content: string): boolean {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // event handlers
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /data:(?!image\/)/i,
  ];

  return !dangerousPatterns.some((pattern) => pattern.test(content));
}
