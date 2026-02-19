import { describe, it, expect, beforeEach, vi } from 'vitest'
import { validateApiKey, constantTimeEqual } from '$lib/security/auth.js'

// Mock the environment
const mockEnv = {
  API_CHAT_KEY: ''
}

// Mock process.env
vi.mock('$app/environment', () => ({
  dev: true,
  browser: false,
  building: false
}))

describe('Security: Authentication', () => {
  describe('constantTimeEqual', () => {
    it('should return true for identical strings', () => {
      expect(constantTimeEqual('hello', 'hello')).toBe(true)
      expect(constantTimeEqual('test-key-123', 'test-key-123')).toBe(true)
    })

    it('should return false for different strings', () => {
      expect(constantTimeEqual('hello', 'world')).toBe(false)
      expect(constantTimeEqual('test-key-123', 'test-key-124')).toBe(false)
    })

    it('should return false for strings of different lengths', () => {
      expect(constantTimeEqual('hello', 'hello!')).toBe(false)
      expect(constantTimeEqual('', 'a')).toBe(false)
    })
  })

  describe('validateApiKey', () => {
    const mockRequestEvent = (apiKey?: string) => ({
      request: {
        headers: {
          get: (name: string) => name === 'x-api-key' ? apiKey || null : null
        }
      }
    }) as any

    beforeEach(() => {
      // Reset environment mock
      mockEnv.API_CHAT_KEY = ''
      // Mock process.env for server-side code
      ;(globalThis as any).process = { env: mockEnv }
    })

    it('should allow access when API key matches', () => {
      mockEnv.API_CHAT_KEY = 'test-key-123'

      const result = validateApiKey(mockRequestEvent('test-key-123'))
      expect(result).toBe(true)
    })

    it('should throw 403 when API key does not match', () => {
      mockEnv.API_CHAT_KEY = 'test-key-123'

      expect(() => validateApiKey(mockRequestEvent('wrong-key'))).toThrow('Forbidden')
    })

    it('should throw 401 when API key is missing but configured', () => {
      mockEnv.API_CHAT_KEY = 'test-key-123'

      expect(() => validateApiKey(mockRequestEvent())).toThrow('Unauthorized')
    })
  })
})
