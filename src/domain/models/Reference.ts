import { z } from 'zod';

/**
 * Zod schema for biblical reference validation
 */
export const ReferenceSchema = z.object({
  book: z.string().min(1, 'Book name is required'),
  chapter: z.number().int().positive('Chapter must be a positive integer'),
  verseStart: z.number().int().positive('Verse start must be positive'),
  verseEnd: z.number().int().positive('Verse end must be positive').optional(),
  display: z.string().min(1, 'Display text is required'),
  translation: z
    .string()
    .min(1, 'Translation is required')
    .default('RVR60')
    .describe('Bible translation code (e.g., RVR60, NVI, ESV)'),
});

/**
 * TypeScript type inferred from Zod schema
 */
export type Reference = z.infer<typeof ReferenceSchema>;

/**
 * Helper function to create a cache key for verse lookup
 */
export function getReferenceCacheKey(ref: Reference): string {
  const verseRange = ref.verseEnd
    ? `${ref.verseStart}-${ref.verseEnd}`
    : `${ref.verseStart}`;
  return `${ref.translation}:${ref.book}:${ref.chapter}:${verseRange}`;
}

/**
 * Helper function to format reference for display
 */
export function formatReference(ref: Reference): string {
  return ref.display;
}
