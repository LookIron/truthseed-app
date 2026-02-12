import {
  BibleProvider,
  FetchVerseResult,
  VerseError,
  VerseResult,
} from '@/domain/services/BibleProvider';
import { Reference } from '@/domain/models/Reference';

/**
 * Bible API Provider that fetches verses from scripture.api.bible
 * Requires API key configuration via environment variables
 */
export class BibleApiProvider implements BibleProvider {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly defaultTranslation: string;

  constructor(
    baseUrl?: string,
    apiKey?: string,
    defaultTranslation: string = 'RVR60'
  ) {
    this.baseUrl = baseUrl || '';
    this.apiKey = apiKey || '';
    this.defaultTranslation = defaultTranslation;
  }

  getName(): string {
    return 'BibleApiProvider';
  }

  isConfigured(): boolean {
    return Boolean(this.baseUrl && this.apiKey);
  }

  async fetchVerse(reference: Reference): Promise<FetchVerseResult> {
    if (!this.isConfigured()) {
      return this.createError(
        reference,
        'Bible API not configured. Please set BIBLE_API_BASE_URL and BIBLE_API_KEY environment variables.'
      );
    }

    try {
      // Call our API route instead of directly calling the Bible API
      // This keeps the API key server-side
      const params = new URLSearchParams({
        book: reference.book,
        chapter: reference.chapter.toString(),
        verseStart: reference.verseStart.toString(),
        ...(reference.verseEnd && {
          verseEnd: reference.verseEnd.toString(),
        }),
        translation: reference.translation || this.defaultTranslation,
      });

      const response = await fetch(`/api/verse?${params}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return this.createError(
          reference,
          errorData.error || `Failed to fetch verse: ${response.statusText}`
        );
      }

      const data = await response.json();
      return this.createResult(reference, data.text, data.translation);
    } catch (error) {
      return this.createError(
        reference,
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private createResult(
    reference: Reference,
    text: string,
    translation: string
  ): VerseResult {
    return {
      text,
      reference,
      translation,
    };
  }

  private createError(reference: Reference, error: string): VerseError {
    return {
      error,
      reference,
    };
  }
}
