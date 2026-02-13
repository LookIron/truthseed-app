import { Reference } from '@/domain/models/Reference';
import { formatVerseIdForApi } from './verse-parser';

/**
 * Response format from docs-bible-api for a verse/passage request
 * API returns:
 * - A single object for single verses
 * - An array of objects for verse ranges
 */
interface ApiVerseItem {
  verse: string;
  number: number;
  study: string;
  id: string;
}

type ApiVerseResponse = ApiVerseItem | ApiVerseItem[];

/**
 * Result of a successful verse fetch
 */
interface VerseData {
  text: string;
  translation: string;
}

/**
 * HTTP client for docs-bible-api
 * Handles retries, timeouts, and error handling
 * No authentication required - free API
 */
export class BibleApiClient {
  private readonly baseUrl: string;
  private readonly translation: string;
  private readonly timeout: number = 10000; // 10 seconds
  private readonly retryDelay: number = 1000; // 1 second

  /**
   * Create a new BibleApiClient
   *
   * @param baseUrl - Base URL for docs-bible-api (defaults to "https://bible-api.deno.dev/api/read")
   * @param translation - Bible translation (e.g., "nvi" for Nueva Versión Internacional)
   */
  constructor(
    baseUrl: string = 'https://bible-api.deno.dev/api/read',
    translation: string = 'nvi'
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.translation = translation;
  }

  /**
   * Fetch verse text for a given reference
   *
   * Implements:
   * - Request timeout (10 seconds)
   * - Retry logic for 5xx errors (1 retry with exponential backoff)
   * - Comprehensive error handling
   * - Graceful failure (returns null instead of throwing)
   *
   * @param reference - The biblical reference to fetch
   * @returns Promise resolving to verse data or null on failure
   */
  async fetchVerse(reference: Reference): Promise<VerseData | null> {
    const verseId = formatVerseIdForApi(reference);

    if (!verseId) {
      console.error(
        `[BibleApiClient] Unable to parse book name: ${reference.book}`
      );
      return null;
    }

    // Use the reference translation or the default translation
    const translationId = reference.translation || this.translation;
    const url = `${this.baseUrl}/${translationId}/${verseId}`;

    // First attempt
    const result = await this.makeRequest(url, reference);

    // If we got a 5xx error, retry once
    if (result === 'retry') {
      console.warn(
        `[BibleApiClient] Retrying request after server error for ${reference.display}`
      );
      await this.delay(this.retryDelay);
      const retryResult = await this.makeRequest(url, reference);
      return retryResult === 'retry' ? null : retryResult;
    }

    return result;
  }

  /**
   * Make a single HTTP request to the API
   *
   * @param url - The full URL to request
   * @param reference - The reference being fetched (for logging)
   * @returns Promise resolving to verse data, null on failure, or 'retry' for 5xx errors
   */
  private async makeRequest(
    url: string,
    reference: Reference
  ): Promise<VerseData | null | 'retry'> {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle various HTTP status codes
      if (response.ok) {
        const data: ApiVerseResponse = await response.json();
        return this.extractVerseText(data, reference);
      }

      // 404 - Verse not found
      if (response.status === 404) {
        console.error(`[BibleApiClient] Verse not found: ${reference.display}`);
        return null;
      }

      // 429 - Rate limit exceeded
      if (response.status === 429) {
        console.error('[BibleApiClient] Rate limit exceeded');
        return null;
      }

      // 5xx - Server errors (retry these)
      if (response.status >= 500) {
        console.error(
          `[BibleApiClient] Server error (${response.status}): ${response.statusText}`
        );
        return 'retry';
      }

      // Other errors
      console.error(
        `[BibleApiClient] API error (${response.status}): ${response.statusText}`
      );
      return null;
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle abort (timeout)
      if (error instanceof Error && error.name === 'AbortError') {
        console.error(
          `[BibleApiClient] Request timeout after ${this.timeout}ms for ${reference.display}`
        );
        return null;
      }

      // Network errors
      console.error(
        `[BibleApiClient] Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      return null;
    }
  }

  /**
   * Extract and clean verse text from API response
   *
   * @param data - The API response data (single object or array of verse objects)
   * @param reference - The reference being fetched
   * @returns Verse data with cleaned text
   */
  private extractVerseText(
    data: ApiVerseResponse,
    reference: Reference
  ): VerseData | null {
    try {
      // Normalize response to always be an array
      const verses = Array.isArray(data) ? data : [data];

      // Validate response
      if (verses.length === 0) {
        console.error(
          `[BibleApiClient] Empty or invalid response for ${reference.display}`
        );
        return null;
      }

      // Extract verse text from each object and join with spaces
      const text = verses
        .map((item) => item.verse)
        .join(' ')
        .replace(/<[^>]+>/g, '') // Remove any HTML tags if present
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

      if (!text) {
        console.error(
          `[BibleApiClient] Empty verse content for ${reference.display}`
        );
        return null;
      }

      return {
        text,
        translation: reference.translation || this.translation,
      };
    } catch (error) {
      console.error(
        `[BibleApiClient] Failed to extract verse text: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      return null;
    }
  }

  /**
   * Delay helper for retry logic
   *
   * @param ms - Milliseconds to delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
