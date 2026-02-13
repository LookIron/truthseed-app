import { BibleProvider } from '@/domain/services/BibleProvider';
import { BibleApiProvider } from '@/infrastructure/bible/BibleApiProvider';
import { getBibleApiConfig } from './env';

/**
 * Create and configure the Bible provider
 *
 * Uses docs-bible-api which is free and requires no authentication.
 *
 * Configuration:
 * - BIBLE_DEFAULT_TRANSLATION: Default translation (optional, defaults to "nvi")
 *
 * @returns A configured BibleApiProvider instance
 *
 * @example
 * ```typescript
 * // With default configuration:
 * const provider = createBibleProvider(); // Returns BibleApiProvider with "nvi" translation
 *
 * // With custom translation:
 * // BIBLE_DEFAULT_TRANSLATION="rvr60"
 * const provider = createBibleProvider(); // Returns BibleApiProvider with "rvr60" translation
 * ```
 */
export function createBibleProvider(): BibleProvider {
  const config = getBibleApiConfig();

  return new BibleApiProvider(config.defaultTranslation);
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
