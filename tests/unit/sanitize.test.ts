import { describe, it, expect } from 'vitest'
import { escapeHtml, sanitizeHtml as sanitize, isContentSafe } from '$lib/security/sanitize.js'

describe('Security: XSS Prevention', () => {
  describe('escapeHtml', () => {
    it('should escape script tags', () => {
      const input = '<script>alert("xss")</script>'
      const result = escapeHtml(input)
      expect(result).not.toContain('<script>')
      expect(result).toContain('&lt;script&gt;')
    })

    it('should escape HTML entities', () => {
      const input = '<div>&nbsp;"test"</div>'
      const result = escapeHtml(input)
      expect(result).toContain('&lt;div&gt;')
      expect(result).toContain('&quot;')
    })

    it('should escape single quotes', () => {
      const input = "it's a test"
      const result = escapeHtml(input)
      expect(result).toContain('&#x27;')
    })

    it('should escape forward slashes', () => {
      const input = '</script>'
      const result = escapeHtml(input)
      expect(result).toContain('&#x2F;')
    })

    it('should handle empty strings', () => {
      const result = escapeHtml('')
      expect(result).toBe('')
    })

    it('should not double escape already escaped content', () => {
      const input = '&lt;test&gt;'
      const result = escapeHtml(input)
      // The & should be escaped
      expect(result).toContain('&amp;lt;')
    })
  })

  describe('sanitizeHtml', () => {
    it('should remove script tags and content', () => {
      const input = '<script>alert("xss")</script>Hello'
      const result = sanitize(input)
      expect(result).not.toContain('<script>')
      expect(result).not.toContain('alert')
      expect(result).toContain('Hello')
    })

    it('should remove event handlers', () => {
      const input = '<div onclick="alert(1)">Click</div>'
      const result = sanitize(input)
      expect(result).not.toContain('onclick')
    })

    it('should remove iframe tags', () => {
      const input = '<iframe src="evil.com"></iframe>'
      const result = sanitize(input)
      expect(result).not.toContain('<iframe')
    })

    it('should remove object tags', () => {
      const input = '<object data="evil.swf"></object>'
      const result = sanitize(input)
      expect(result).not.toContain('<object')
    })

    it('should remove embed tags', () => {
      const input = '<embed src="evil.swf">'
      const result = sanitize(input)
      expect(result).not.toContain('<embed')
    })

    it('should remove javascript: protocol', () => {
      const input = '<a href="javascript:alert(1)">Click</a>'
      const result = sanitize(input)
      expect(result).not.toContain('javascript:')
    })

    it('should preserve safe image data URIs', () => {
      const input = '<img src="data:image/png;base64,abc123">'
      const result = sanitize(input)
      expect(result).toContain('data:image/png')
    })

    it('should remove dangerous data URIs', () => {
      const input = '<a href="data:text/html,<script>alert(1)</script>">Click</a>'
      const result = sanitize(input)
      expect(result).not.toContain('data:text/html')
    })
  })

  describe('isContentSafe', () => {
    it('should return true for safe content', () => {
      expect(isContentSafe('Hello, world!')).toBe(true)
      expect(isContentSafe('Normal text with links: https://example.com')).toBe(true)
      expect(isContentSafe('Code: const x = 1;')).toBe(true)
    })

    it('should return false for script tags', () => {
      expect(isContentSafe('<script>alert(1)</script>')).toBe(false)
      expect(isContentSafe('<SCRIPT>alert(1)</SCRIPT>')).toBe(false)
    })

    it('should return false for javascript: protocol', () => {
      expect(isContentSafe('javascript:alert(1)')).toBe(false)
      expect(isContentSafe('JAVASCRIPT:alert(1)')).toBe(false)
    })

    it('should return false for event handlers', () => {
      expect(isContentSafe('onclick="alert(1)"')).toBe(false)
      expect(isContentSafe('ONERROR="alert(1)"')).toBe(false)
    })

    it('should return false for iframe tags', () => {
      expect(isContentSafe('<iframe src="evil.com">')).toBe(false)
      expect(isContentSafe('<IFRAME src="evil.com">')).toBe(false)
    })

    it('should return false for object tags', () => {
      expect(isContentSafe('<object data="evil.swf">')).toBe(false)
    })

    it('should return false for embed tags', () => {
      expect(isContentSafe('<embed src="evil.swf">')).toBe(false)
    })

    it('should return false for dangerous data URIs', () => {
      expect(isContentSafe('data:text/html,<script>')).toBe(false)
    })

    it('should return true for safe image data URIs', () => {
      expect(isContentSafe('data:image/png;base64,abc123')).toBe(true)
      expect(isContentSafe('data:image/gif;base64,abc123')).toBe(true)
      expect(isContentSafe('data:image/jpeg;base64,abc123')).toBe(true)
      expect(isContentSafe('data:image/webp;base64,abc123')).toBe(true)
    })
  })
})
