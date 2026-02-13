import { BibleProvider } from '@/domain/services/BibleProvider';
import { BibleApiProvider } from '@/infrastructure/bible/BibleApiProvider';
import { MockBibleProvider } from '@/infrastructure/bible/MockBibleProvider';
import { getBibleApiConfig } from './env';

/**
 * Create and configure the appropriate Bible provider based on environment configuration
 *
 * Configuration requirements:
 * - BIBLE_API_BASE_URL: Base URL for scripture.api.bible (e.g., "https://api.scripture.api.bible/v1")
 * - BIBLE_API_KEY: API key for authentication
 * - BIBLE_DEFAULT_TRANSLATION: Default translation/Bible ID (optional, defaults to "RVR60")
 *
 * Provider selection logic:
 * - If all environment variables are properly configured (non-empty strings), returns BibleApiProvider
 * - If any environment variable is missing or empty, returns MockBibleProvider as fallback
 *
 * Fallback behavior:
 * - Logs a console warning when falling back to MockBibleProvider
 * - MockBibleProvider returns sample verses for testing without external API calls
 *
 * @returns A configured BibleProvider instance (either BibleApiProvider or MockBibleProvider)
 *
 * @example
 * ```typescript
 * // With proper configuration:
 * // BIBLE_API_BASE_URL="https://api.scripture.api.bible/v1"
 * // BIBLE_API_KEY="your-api-key"
 * // BIBLE_DEFAULT_TRANSLATION="RVR60"
 * const provider = createBibleProvider(); // Returns BibleApiProvider
 *
 * // Without configuration or missing variables:
 * const provider = createBibleProvider(); // Returns MockBibleProvider (logs warning)
 * ```
 */
export function createBibleProvider(): BibleProvider {
  const config = getBibleApiConfig();

  // Validate configuration - all fields must be non-empty strings
  const isConfigured =
    Boolean(config.baseUrl) &&
    Boolean(config.apiKey) &&
    Boolean(config.defaultTranslation);

  if (isConfigured) {
    return new BibleApiProvider(
      config.baseUrl,
      config.apiKey,
      config.defaultTranslation
    );
  }

  // Log warning about missing configuration
  console.warn(
    '[BibleProviderFactory] Bible API not fully configured. Missing one or more of: BIBLE_API_BASE_URL, BIBLE_API_KEY, BIBLE_DEFAULT_TRANSLATION. Falling back to MockBibleProvider.'
  );

  return new MockBibleProvider();
}

/**
 * Singleton instance of the Bible provider
 *
 * Use this singleton to ensure consistent provider usage across the application
 * and prevent multiple provider instantiations.
 *
 * @example
 * ```typescript
 * import { bibleProvider } from '@/lib/bible-provider-factory';
 *
 * const result = await bibleProvider.fetchVerse(reference);
 * ```
 */
export const bibleProvider = createBibleProvider();
