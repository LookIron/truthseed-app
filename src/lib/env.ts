/**
 * Type-safe environment variable access
 * Validates and provides defaults for environment variables
 */

/**
 * Get Bible API configuration from environment
 * docs-bible-api is free and requires no authentication
 */
export function getBibleApiConfig() {
  return {
    defaultTranslation: process.env.BIBLE_DEFAULT_TRANSLATION || 'nvi',
  };
}

/**
 * Get app configuration from environment
 */
export function getAppConfig() {
  return {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'TruthSeed',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
  };
}

/**
 * Check if Bible API is configured
 * Always returns true since docs-bible-api requires no configuration
 */
export function isBibleApiConfigured(): boolean {
  return true;
}

/**
 * Get environment variable or throw error if not found
 * @param key Environment variable key
 * @param defaultValue Optional default value
 */
export function getEnvOrThrow(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Get environment variable or return default
 * @param key Environment variable key
 * @param defaultValue Default value
 */
export function getEnvOrDefault(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}
