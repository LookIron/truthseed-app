import { Reference } from '../models/Reference';

/**
 * Result of a verse fetch operation
 */
export interface VerseResult {
  text: string;
  reference: Reference;
  translation: string;
  error?: never;
}

/**
 * Error result when verse fetching fails
 */
export interface VerseError {
  error: string;
  reference: Reference;
  text?: never;
  translation?: never;
}

export type FetchVerseResult = VerseResult | VerseError;

/**
 * Interface for Bible text providers
 * Implementations can use different APIs or data sources
 */
export interface BibleProvider {
  /**
   * Fetches verse text for a given reference
   * @param reference The biblical reference to fetch
   * @returns Promise resolving to verse text or error
   */
  fetchVerse(reference: Reference): Promise<FetchVerseResult>;

  /**
   * Returns whether this provider is properly configured
   */
  isConfigured(): boolean;

  /**
   * Returns the provider name for debugging
   */
  getName(): string;
}

/**
 * Type guard to check if result is an error
 */
export function isVerseError(result: FetchVerseResult): result is VerseError {
  return 'error' in result && result.error !== undefined;
}
