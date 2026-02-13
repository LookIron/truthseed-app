import { Reference } from '@/domain/models/Reference';
import { formatVerseIdForApi } from './verse-parser';

/**
 * Response format from scripture.api.bible for a verse/passage request
 */
interface ApiVerseResponse {
  data: {
    id: string;
    orgId: string;
    bibleId: string;
    bookId: string;
    chapterId: string;
    content: string;
    reference: string;
    verseCount?: number;
    copyright?: string;
  };
}

/**
 * Error response from scripture.api.bible
 */
interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
}

/**
 * Result of a successful verse fetch
 */
interface VerseData {
  text: string;
  translation: string;
}

/**
 * HTTP client for scripture.api.bible
 * Handles authentication, retries, timeouts, and error handling
 */
export class BibleApiClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly bibleId: string;
  private readonly timeout: number = 10000; // 10 seconds
  private readonly retryDelay: number = 1000; // 1 second

  /**
   * Create a new BibleApiClient
   *
   * @param baseUrl - Base URL for scripture.api.bible (e.g., "https://api.scripture.api.bible/v1")
   * @param apiKey - API key for authentication
   * @param bibleId - Bible translation ID (e.g., "592420522e16049f-01" for RVR60)
   */
  constructor(baseUrl: string, apiKey: string, bibleId: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.apiKey = apiKey;
    this.bibleId = bibleId;
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

    // Use the reference translation or the default bibleId
    const translationId = reference.translation || this.bibleId;
    const url = `${this.baseUrl}/bibles/${translationId}/passages/${verseId}`;

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
          'api-key': this.apiKey,
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

      // 401 - Invalid API key
      if (response.status === 401) {
        console.error(
          '[BibleApiClient] Authentication failed: Invalid API key'
        );
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
      const errorData: ApiErrorResponse = await response.json().catch(() => ({
        statusCode: response.status,
        message: response.statusText,
      }));
      console.error(
        `[BibleApiClient] API error (${errorData.statusCode}): ${errorData.message}`
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
   * @param data - The API response data
   * @param reference - The reference being fetched
   * @returns Verse data with cleaned text
   */
  private extractVerseText(
    data: ApiVerseResponse,
    reference: Reference
  ): VerseData | null {
    try {
      // The content field contains HTML - we need to strip tags
      const htmlContent = data.data.content;

      // Remove HTML tags and clean up whitespace
      const text = htmlContent
        .replace(/<[^>]+>/g, '') // Remove all HTML tags
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
        translation: data.data.bibleId,
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
