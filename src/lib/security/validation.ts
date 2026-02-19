import { z } from 'zod'

/**
 * Message role enum
 */
export const messageRoleSchema = z.enum(['user', 'assistant', 'system'])

/**
 * Single message schema
 */
export const messageSchema = z.object({
  role: messageRoleSchema,
  content: z.string()
    .min(1, 'Message content cannot be empty')
    .max(100000, 'Message content exceeds maximum length of 100000 characters')
    .refine(
      (val) => !/<script[\s\S]*?>[\s\S]*?<\/script>/gi.test(val),
      'Message content contains potentially dangerous HTML'
    ),
  timestamp: z.number().optional()
})

/**
 * Chat request schema
 */
export const chatRequestSchema = z.object({
  messages: z.array(messageSchema)
    .min(1, 'At least one message is required')
    .max(100, 'Cannot process more than 100 messages at once')
    .refine(
      (messages) => {
        // Ensure system messages (if any) come first
        let sawNonSystem = false
        for (const msg of messages) {
          if (msg.role === 'system' && sawNonSystem) {
            return false
          }
          if (msg.role !== 'system') {
            sawNonSystem = true
          }
        }
        return true
      },
      'System messages must come first'
    ),
  model: z.string()
    .min(1, 'Model cannot be empty')
    .max(100, 'Model name exceeds maximum length'),
  provider: z.string()
    .min(1, 'Provider cannot be empty')
    .max(50, 'Provider name exceeds maximum length')
    .optional(),
  stream: z.boolean().optional().default(true)
})

/**
 * Provider name validation - must be alphanumeric with hyphens/underscores
 */
export const providerNameSchema = z.string()
  .min(1, 'Provider name cannot be empty')
  .max(50, 'Provider name exceeds maximum length')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Provider name can only contain letters, numbers, hyphens, and underscores')

/**
 * Model name validation
 */
export const modelNameSchema = z.string()
  .min(1, 'Model name cannot be empty')
  .max(100, 'Model name exceeds maximum length')
  .regex(/^[a-zA-Z0-9._-]+$/, 'Model name contains invalid characters')

/**
 * Sanitize HTML content to prevent XSS
 * @param content - The content to sanitize
 * @returns Sanitized content with HTML entities escaped
 */
export function sanitizeHtml(content: string): string {
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Whitelist-based provider validation
 * @param providerName - The provider name to validate
 * @param availableProviders - Array of available provider names
 * @returns true if provider is in whitelist
 */
export function isValidProvider(
  providerName: string,
  availableProviders: string[]
): boolean {
  return availableProviders.includes(providerName)
}

/**
 * Whitelist-based model validation
 * @param modelName - The model name to validate
 * @param availableModels - Array of available model names
 * @returns true if model is in whitelist
 */
export function isValidModel(
  modelName: string,
  availableModels: string[]
): boolean {
  return availableModels.includes(modelName)
}

// Export types inferred from schemas
export type ChatRequest = z.infer<typeof chatRequestSchema>
export type Message = z.infer<typeof messageSchema>
export type MessageRole = z.infer<typeof messageRoleSchema>
