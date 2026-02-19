import { error } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";

/**
 * API Authentication Configuration
 *
 * For production, set API_CHAT_KEY in environment variables.
 * If not set, authentication is disabled (development mode only).
 */
const API_KEY_HEADER = "x-api-key";
const DEV_MODE = import.meta.env.MODE === "development";

/**
 * Validates API key from request headers
 * @param requestEvent - The SvelteKit request event
 * @returns true if authenticated, throws error otherwise
 */
export function validateApiKey(requestEvent: RequestEvent): boolean {
  // Get API key from environment - check both server and client env vars
  const apiKey =
    process.env.API_CHAT_KEY ||
    (typeof import.meta !== "undefined" &&
      import.meta.env?.VITE_API_CHAT_KEY) ||
    "";

  // If no API key is configured and we're in dev mode, allow access
  // Note: In dev mode (import.meta.env.MODE === 'development'), auth is optional
  if (!apiKey && DEV_MODE) {
    console.warn(
      "WARNING: No API_CHAT_KEY configured. Authentication disabled in development mode.",
    );
    return true;
  }

  // If API key is required but not provided in request, check if configured
  if (!apiKey) {
    // No key configured - in dev this is a warning, in prod this is an error
    if (DEV_MODE) {
      console.warn(
        "WARNING: API_CHAT_KEY not configured. Allowing request for development.",
      );
      return true;
    }
    throw error(500, "Server configuration error: API key not configured");
  }

  // Extract API key from headers
  const requestApiKey = requestEvent.request.headers.get(API_KEY_HEADER);

  if (!requestApiKey) {
    throw error(401, "Unauthorized: API key required");
  }

  // Validate API key using constant-time comparison to prevent timing attacks
  if (!constantTimeEqual(requestApiKey, apiKey)) {
    throw error(403, "Forbidden: Invalid API key");
  }

  return true;
}

/**
 * Constant-time string comparison to prevent timing attacks
 * @param a - First string
 * @param b - Second string
 * @returns true if strings are equal
 */
export function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Middleware helper for API routes
 * Call this at the start of any protected endpoint
 */
export function requireAuth(requestEvent: RequestEvent): void {
  validateApiKey(requestEvent);
}
