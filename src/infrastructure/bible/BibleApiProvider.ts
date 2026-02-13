import {
  BibleProvider,
  FetchVerseResult,
  VerseError,
  VerseResult,
} from '@/domain/services/BibleProvider';
import { Reference } from '@/domain/models/Reference';

/**
 * Bible API Provider that fetches verses from docs-bible-api
 * Free API - no authentication required
 */
export class BibleApiProvider implements BibleProvider {
  private readonly defaultTranslation: string;

  constructor(defaultTranslation: string = 'nvi') {
    this.defaultTranslation = defaultTranslation;
  }

  getName(): string {
    return 'BibleApiProvider';
  }

  isConfigured(): boolean {
    return true;
  }

  async fetchVerse(reference: Reference): Promise<FetchVerseResult> {
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
