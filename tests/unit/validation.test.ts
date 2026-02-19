import { describe, it, expect } from 'vitest'
import {
  chatRequestSchema,
  messageSchema,
  providerNameSchema,
  modelNameSchema,
  sanitizeHtml,
  isValidProvider,
  isValidModel
} from '$lib/security/validation.js'

describe('Security: Input Validation', () => {
  describe('messageSchema', () => {
    it('should validate valid messages', () => {
      const validMessage = {
        role: 'user',
        content: 'Hello, world!'
      }
      const result = messageSchema.safeParse(validMessage)
      expect(result.success).toBe(true)
    })

    it('should reject empty content', () => {
      const invalidMessage = {
        role: 'user',
        content: ''
      }
      const result = messageSchema.safeParse(invalidMessage)
      expect(result.success).toBe(false)
    })

    it('should reject content exceeding max length', () => {
      const invalidMessage = {
        role: 'user',
        content: 'a'.repeat(100001)
      }
      const result = messageSchema.safeParse(invalidMessage)
      expect(result.success).toBe(false)
    })

    it('should reject script tags in content', () => {
      const invalidMessage = {
        role: 'user',
        content: '<script>alert("xss")</script>'
      }
      const result = messageSchema.safeParse(invalidMessage)
      expect(result.success).toBe(false)
    })

    it('should accept valid roles', () => {
      const roles = ['user', 'assistant', 'system']
      roles.forEach(role => {
        const message = { role, content: 'test' }
        const result = messageSchema.safeParse(message)
        expect(result.success).toBe(true)
      })
    })

    it('should reject invalid roles', () => {
      const message = {
        role: 'admin',
        content: 'test'
      }
      const result = messageSchema.safeParse(message)
      expect(result.success).toBe(false)
    })
  })

  describe('chatRequestSchema', () => {
    it('should validate valid chat requests', () => {
      const validRequest = {
        messages: [
          { role: 'user', content: 'Hello' }
        ],
        model: 'mock-model-1',
        stream: true
      }
      const result = chatRequestSchema.safeParse(validRequest)
      expect(result.success).toBe(true)
    })

    it('should reject empty messages array', () => {
      const invalidRequest = {
        messages: [],
        model: 'mock-model-1'
      }
      const result = chatRequestSchema.safeParse(invalidRequest)
      expect(result.success).toBe(false)
    })

    it('should reject messages exceeding max count', () => {
      const invalidRequest = {
        messages: Array(101).fill({ role: 'user', content: 'test' }),
        model: 'mock-model-1'
      }
      const result = chatRequestSchema.safeParse(invalidRequest)
      expect(result.success).toBe(false)
    })

    it('should reject system messages not at the start', () => {
      const invalidRequest = {
        messages: [
          { role: 'user', content: 'Hello' },
          { role: 'system', content: 'You are helpful' }
        ],
        model: 'mock-model-1'
      }
      const result = chatRequestSchema.safeParse(invalidRequest)
      expect(result.success).toBe(false)
    })

    it('should require model parameter', () => {
      const invalidRequest = {
        messages: [{ role: 'user', content: 'Hello' }]
      }
      const result = chatRequestSchema.safeParse(invalidRequest)
      expect(result.success).toBe(false)
    })
  })

  describe('providerNameSchema', () => {
    it('should accept valid provider names', () => {
      const validNames = ['mock', 'openai', 'anthropic-claude', 'google_ai']
      validNames.forEach(name => {
        const result = providerNameSchema.safeParse(name)
        expect(result.success).toBe(true)
      })
    })

    it('should reject provider names with special characters', () => {
      const invalidNames = ['mock$', 'openai@', 'test space', 'test.dot']
      invalidNames.forEach(name => {
        const result = providerNameSchema.safeParse(name)
        expect(result.success).toBe(false)
      })
    })

    it('should reject empty provider names', () => {
      const result = providerNameSchema.safeParse('')
      expect(result.success).toBe(false)
    })
  })

  describe('modelNameSchema', () => {
    it('should accept valid model names', () => {
      const validNames = ['gpt-4', 'claude-3-opus', 'mock-model-1', 'gemini-pro']
      validNames.forEach(name => {
        const result = modelNameSchema.safeParse(name)
        expect(result.success).toBe(true)
      })
    })

    it('should reject model names with invalid characters', () => {
      const invalidNames = ['model$', 'test@model', 'model name']
      invalidNames.forEach(name => {
        const result = modelNameSchema.safeParse(name)
        expect(result.success).toBe(false)
      })
    })
  })

  describe('sanitizeHtml', () => {
    it('should escape HTML entities', () => {
      const input = '<script>alert("xss")</script>'
      const result = sanitizeHtml(input)
      expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;')
    })

    it('should escape common XSS patterns', () => {
      const input = '<img src=x onerror="alert(1)">'
      const result = sanitizeHtml(input)
      expect(result).toContain('&lt;')
      expect(result).toContain('&gt;')
    })

    it('should handle normal text', () => {
      const input = 'Hello, world!'
      const result = sanitizeHtml(input)
      expect(result).toBe('Hello, world!')
    })
  })

  describe('isValidProvider', () => {
    it('should return true for valid providers', () => {
      const availableProviders = ['mock', 'openai', 'anthropic']
      expect(isValidProvider('mock', availableProviders)).toBe(true)
      expect(isValidProvider('openai', availableProviders)).toBe(true)
    })

    it('should return false for invalid providers', () => {
      const availableProviders = ['mock', 'openai', 'anthropic']
      expect(isValidProvider('invalid', availableProviders)).toBe(false)
      expect(isValidProvider('', availableProviders)).toBe(false)
    })
  })

  describe('isValidModel', () => {
    it('should return true for valid models', () => {
      const availableModels = ['gpt-4', 'gpt-3.5-turbo', 'claude-3']
      expect(isValidModel('gpt-4', availableModels)).toBe(true)
      expect(isValidModel('claude-3', availableModels)).toBe(true)
    })

    it('should return false for invalid models', () => {
      const availableModels = ['gpt-4', 'gpt-3.5-turbo']
      expect(isValidModel('invalid-model', availableModels)).toBe(false)
    })
  })
})
