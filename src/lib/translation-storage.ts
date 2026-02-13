/**
 * Translation storage utility for localStorage persistence
 * Manages Bible translation preference across sessions
 */

const STORAGE_KEY = 'truthseed:bible:translation';
const DEFAULT_TRANSLATION = 'rv1960';

/**
 * Supported Bible translations
 */
export type Translation = 'rv1960' | 'rv1995' | 'nvi' | 'dhh' | 'pdt' | 'kjv';

/**
 * Get the user's saved translation preference from localStorage
 * Returns default translation (rv1960) if not set
 */
export function getTranslation(): Translation {
  if (typeof window === 'undefined') {
    return DEFAULT_TRANSLATION;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isValidTranslation(stored)) {
      return stored as Translation;
    }
  } catch (error) {
    console.error('Failed to read translation from localStorage:', error);
  }

  return DEFAULT_TRANSLATION;
}

/**
 * Save the user's translation preference to localStorage
 */
export function setTranslation(translation: Translation): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, translation);
  } catch (error) {
    console.error('Failed to save translation to localStorage:', error);
  }
}

/**
 * Check if a string is a valid translation code
 */
function isValidTranslation(value: string): boolean {
  const validTranslations: string[] = [
    'rv1960',
    'rv1995',
    'nvi',
    'dhh',
    'pdt',
    'kjv',
  ];
  return validTranslations.includes(value);
}
