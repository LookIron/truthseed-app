import { Reference } from '@/domain/models/Reference';

/**
 * Map of Spanish Bible book names to scripture.api.bible book codes
 * Covers all 66 books of the Bible (Old and New Testament)
 */
const SPANISH_BOOK_MAP: Record<string, string> = {
  // Old Testament
  génesis: 'GEN',
  genesis: 'GEN',
  éxodo: 'EXO',
  exodo: 'EXO',
  levítico: 'LEV',
  levitico: 'LEV',
  números: 'NUM',
  numeros: 'NUM',
  deuteronomio: 'DEU',
  josué: 'JOS',
  josue: 'JOS',
  jueces: 'JDG',
  rut: 'RUT',
  '1 samuel': '1SA',
  '2 samuel': '2SA',
  '1 reyes': '1KI',
  '2 reyes': '2KI',
  '1 crónicas': '1CH',
  '1 cronicas': '1CH',
  '2 crónicas': '2CH',
  '2 cronicas': '2CH',
  esdras: 'EZR',
  nehemías: 'NEH',
  nehemias: 'NEH',
  ester: 'EST',
  job: 'JOB',
  salmos: 'PSA',
  salmo: 'PSA',
  proverbios: 'PRO',
  eclesiastés: 'ECC',
  ecclesiastes: 'ECC',
  cantares: 'SNG',
  'cantar de los cantares': 'SNG',
  isaías: 'ISA',
  isaias: 'ISA',
  jeremías: 'JER',
  jeremias: 'JER',
  lamentaciones: 'LAM',
  ezequiel: 'EZK',
  daniel: 'DAN',
  oseas: 'HOS',
  joel: 'JOL',
  amós: 'AMO',
  amos: 'AMO',
  abdías: 'OBA',
  abdias: 'OBA',
  jonás: 'JON',
  jonas: 'JON',
  miqueas: 'MIC',
  nahúm: 'NAM',
  nahum: 'NAM',
  habacuc: 'HAB',
  sofonías: 'ZEP',
  sofonias: 'ZEP',
  hageo: 'HAG',
  zacarías: 'ZEC',
  zacarias: 'ZEC',
  malaquías: 'MAL',
  malaquias: 'MAL',

  // New Testament
  mateo: 'MAT',
  marcos: 'MRK',
  lucas: 'LUK',
  juan: 'JHN',
  hechos: 'ACT',
  romanos: 'ROM',
  '1 corintios': '1CO',
  '2 corintios': '2CO',
  gálatas: 'GAL',
  galatas: 'GAL',
  efesios: 'EPH',
  filipenses: 'PHP',
  colosenses: 'COL',
  '1 tesalonicenses': '1TH',
  '2 tesalonicenses': '2TH',
  '1 timoteo': '1TI',
  '2 timoteo': '2TI',
  tito: 'TIT',
  filemón: 'PHM',
  filemon: 'PHM',
  hebreos: 'HEB',
  santiago: 'JAS',
  '1 pedro': '1PE',
  '2 pedro': '2PE',
  '1 juan': '1JN',
  '2 juan': '2JN',
  '3 juan': '3JN',
  judas: 'JUD',
  apocalipsis: 'REV',
};

/**
 * Parse a Spanish book name and convert it to scripture.api.bible book code
 *
 * @param bookName - The Spanish name of the book (e.g., "Génesis", "1 Juan", "2 Corintios")
 * @returns The API book code (e.g., "GEN", "1JN", "2CO") or null if not recognized
 *
 * @example
 * ```typescript
 * parseSpanishBookName("Génesis") // returns "GEN"
 * parseSpanishBookName("1 Juan") // returns "1JN"
 * parseSpanishBookName("2 Corintios") // returns "2CO"
 * parseSpanishBookName("Invalid") // returns null
 * ```
 */
export function parseSpanishBookName(bookName: string): string | null {
  // Normalize: lowercase and trim whitespace
  const normalized = bookName.toLowerCase().trim();

  // Direct lookup in the map
  return SPANISH_BOOK_MAP[normalized] || null;
}

/**
 * Format a Reference object into scripture.api.bible verse ID format
 *
 * Converts a Reference to the format expected by the API:
 * - Single verse: "BOOK.CHAPTER.VERSE" (e.g., "MAT.5.13")
 * - Verse range: "BOOK.CHAPTER.START-BOOK.CHAPTER.END" (e.g., "MAT.5.13-MAT.5.14")
 *
 * @param reference - The Reference object to format
 * @returns The formatted verse ID string, or null if the book name cannot be parsed
 *
 * @example
 * ```typescript
 * const ref = {
 *   book: "Mateo",
 *   chapter: 5,
 *   verseStart: 13,
 *   display: "Mateo 5:13",
 *   translation: "RVR60"
 * };
 * formatVerseIdForApi(ref) // returns "MAT.5.13"
 *
 * const rangeRef = {
 *   book: "Mateo",
 *   chapter: 5,
 *   verseStart: 13,
 *   verseEnd: 14,
 *   display: "Mateo 5:13-14",
 *   translation: "RVR60"
 * };
 * formatVerseIdForApi(rangeRef) // returns "MAT.5.13-MAT.5.14"
 * ```
 */
export function formatVerseIdForApi(reference: Reference): string | null {
  // Parse the book name to get API code
  const bookCode = parseSpanishBookName(reference.book);

  if (!bookCode) {
    return null;
  }

  const { chapter, verseStart, verseEnd } = reference;

  // Format single verse: BOOK.CHAPTER.VERSE
  if (!verseEnd || verseEnd === verseStart) {
    return `${bookCode}.${chapter}.${verseStart}`;
  }

  // Format verse range: BOOK.CHAPTER.START-BOOK.CHAPTER.END
  return `${bookCode}.${chapter}.${verseStart}-${bookCode}.${chapter}.${verseEnd}`;
}

/**
 * Get all supported Spanish book names
 * Useful for validation and autocomplete features
 *
 * @returns Array of all Spanish book names supported by the parser
 */
export function getSupportedBookNames(): string[] {
  return Object.keys(SPANISH_BOOK_MAP);
}

/**
 * Check if a book name is supported
 *
 * @param bookName - The Spanish name of the book to check
 * @returns true if the book is supported, false otherwise
 */
export function isBookNameSupported(bookName: string): boolean {
  return parseSpanishBookName(bookName) !== null;
}
