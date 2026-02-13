import { Reference } from '@/domain/models/Reference';

/**
 * Map of Spanish Bible book names to docs-bible-api lowercase book names
 * Covers all 66 books of the Bible (Old and New Testament)
 */
const SPANISH_BOOK_MAP: Record<string, string> = {
  // Old Testament
  génesis: 'genesis',
  genesis: 'genesis',
  éxodo: 'exodo',
  exodo: 'exodo',
  levítico: 'levitico',
  levitico: 'levitico',
  números: 'numeros',
  numeros: 'numeros',
  deuteronomio: 'deuteronomio',
  josué: 'josue',
  josue: 'josue',
  jueces: 'jueces',
  rut: 'rut',
  '1 samuel': '1-samuel',
  '2 samuel': '2-samuel',
  '1 reyes': '1-reyes',
  '2 reyes': '2-reyes',
  '1 crónicas': '1-cronicas',
  '1 cronicas': '1-cronicas',
  '2 crónicas': '2-cronicas',
  '2 cronicas': '2-cronicas',
  esdras: 'esdras',
  nehemías: 'nehemias',
  nehemias: 'nehemias',
  ester: 'ester',
  job: 'job',
  salmos: 'salmos',
  salmo: 'salmos',
  proverbios: 'proverbios',
  eclesiastés: 'eclesiastes',
  ecclesiastes: 'eclesiastes',
  cantares: 'cantares',
  'cantar de los cantares': 'cantares',
  isaías: 'isaias',
  isaias: 'isaias',
  jeremías: 'jeremias',
  jeremias: 'jeremias',
  lamentaciones: 'lamentaciones',
  ezequiel: 'ezequiel',
  daniel: 'daniel',
  oseas: 'oseas',
  joel: 'joel',
  amós: 'amos',
  amos: 'amos',
  abdías: 'abdias',
  abdias: 'abdias',
  jonás: 'jonas',
  jonas: 'jonas',
  miqueas: 'miqueas',
  nahúm: 'nahum',
  nahum: 'nahum',
  habacuc: 'habacuc',
  sofonías: 'sofonias',
  sofonias: 'sofonias',
  hageo: 'hageo',
  zacarías: 'zacarias',
  zacarias: 'zacarias',
  malaquías: 'malaquias',
  malaquias: 'malaquias',

  // New Testament
  mateo: 'mateo',
  marcos: 'marcos',
  lucas: 'lucas',
  juan: 'juan',
  hechos: 'hechos',
  romanos: 'romanos',
  '1 corintios': '1-corintios',
  '2 corintios': '2-corintios',
  gálatas: 'galatas',
  galatas: 'galatas',
  efesios: 'efesios',
  filipenses: 'filipenses',
  colosenses: 'colosenses',
  '1 tesalonicenses': '1-tesalonicenses',
  '2 tesalonicenses': '2-tesalonicenses',
  '1 timoteo': '1-timoteo',
  '2 timoteo': '2-timoteo',
  tito: 'tito',
  filemón: 'filemon',
  filemon: 'filemon',
  hebreos: 'hebreos',
  santiago: 'santiago',
  '1 pedro': '1-pedro',
  '2 pedro': '2-pedro',
  '1 juan': '1-juan',
  '2 juan': '2-juan',
  '3 juan': '3-juan',
  judas: 'judas',
  apocalipsis: 'apocalipsis',
};

/**
 * Parse a Spanish book name and convert it to docs-bible-api book name
 *
 * @param bookName - The Spanish name of the book (e.g., "Génesis", "1 Juan", "2 Corintios")
 * @returns The lowercase book name (e.g., "genesis", "1-juan", "2-corintios") or null if not recognized
 *
 * @example
 * ```typescript
 * parseSpanishBookName("Génesis") // returns "genesis"
 * parseSpanishBookName("1 Juan") // returns "1-juan"
 * parseSpanishBookName("2 Corintios") // returns "2-corintios"
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
 * Format a Reference object into docs-bible-api path format
 *
 * Converts a Reference to the format expected by the API:
 * - Single verse: "book/chapter/verse" (e.g., "mateo/5/13")
 * - Verse range: "book/chapter/start-end" (e.g., "mateo/5/13-14")
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
 * formatVerseIdForApi(ref) // returns "mateo/5/13"
 *
 * const rangeRef = {
 *   book: "Mateo",
 *   chapter: 5,
 *   verseStart: 13,
 *   verseEnd: 14,
 *   display: "Mateo 5:13-14",
 *   translation: "RVR60"
 * };
 * formatVerseIdForApi(rangeRef) // returns "mateo/5/13-14"
 * ```
 */
export function formatVerseIdForApi(reference: Reference): string | null {
  // Parse the book name to get lowercase book name
  const bookName = parseSpanishBookName(reference.book);

  if (!bookName) {
    return null;
  }

  const { chapter, verseStart, verseEnd } = reference;

  // Format single verse: book/chapter/verse
  if (!verseEnd || verseEnd === verseStart) {
    return `${bookName}/${chapter}/${verseStart}`;
  }

  // Format verse range: book/chapter/start-end
  return `${bookName}/${chapter}/${verseStart}-${verseEnd}`;
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
