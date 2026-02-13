import { describe, it, expect } from 'vitest';
import {
  parseSpanishBookName,
  formatVerseIdForApi,
  isBookNameSupported,
  getSupportedBookNames,
} from '@/lib/verse-parser';
import { Reference } from '@/domain/models/Reference';

describe('parseSpanishBookName', () => {
  describe('Old Testament books', () => {
    it('should parse Génesis with accent', () => {
      expect(parseSpanishBookName('Génesis')).toBe('genesis');
    });

    it('should parse Genesis without accent', () => {
      expect(parseSpanishBookName('Genesis')).toBe('genesis');
    });

    it('should parse Éxodo with accent', () => {
      expect(parseSpanishBookName('Éxodo')).toBe('exodo');
    });

    it('should parse Exodo without accent', () => {
      expect(parseSpanishBookName('Exodo')).toBe('exodo');
    });

    it('should parse Números with accent', () => {
      expect(parseSpanishBookName('Números')).toBe('numeros');
    });

    it('should parse Numeros without accent', () => {
      expect(parseSpanishBookName('Numeros')).toBe('numeros');
    });

    it('should parse 1 Samuel', () => {
      expect(parseSpanishBookName('1 Samuel')).toBe('1-samuel');
    });

    it('should parse 2 Samuel', () => {
      expect(parseSpanishBookName('2 Samuel')).toBe('2-samuel');
    });

    it('should parse 1 Reyes', () => {
      expect(parseSpanishBookName('1 Reyes')).toBe('1-reyes');
    });

    it('should parse 2 Reyes', () => {
      expect(parseSpanishBookName('2 Reyes')).toBe('2-reyes');
    });

    it('should parse 1 Crónicas with accent', () => {
      expect(parseSpanishBookName('1 Crónicas')).toBe('1-cronicas');
    });

    it('should parse 1 Cronicas without accent', () => {
      expect(parseSpanishBookName('1 Cronicas')).toBe('1-cronicas');
    });

    it('should parse 2 Crónicas with accent', () => {
      expect(parseSpanishBookName('2 Crónicas')).toBe('2-cronicas');
    });

    it('should parse Salmos', () => {
      expect(parseSpanishBookName('Salmos')).toBe('salmos');
    });

    it('should parse Salmo (singular)', () => {
      expect(parseSpanishBookName('Salmo')).toBe('salmos');
    });

    it('should parse Isaías with accent', () => {
      expect(parseSpanishBookName('Isaías')).toBe('isaias');
    });

    it('should parse Isaias without accent', () => {
      expect(parseSpanishBookName('Isaias')).toBe('isaias');
    });

    it('should parse Daniel', () => {
      expect(parseSpanishBookName('Daniel')).toBe('daniel');
    });

    it('should parse Malaquías with accent', () => {
      expect(parseSpanishBookName('Malaquías')).toBe('malaquias');
    });
  });

  describe('New Testament books', () => {
    it('should parse Mateo', () => {
      expect(parseSpanishBookName('Mateo')).toBe('mateo');
    });

    it('should parse Marcos', () => {
      expect(parseSpanishBookName('Marcos')).toBe('marcos');
    });

    it('should parse Lucas', () => {
      expect(parseSpanishBookName('Lucas')).toBe('lucas');
    });

    it('should parse Juan', () => {
      expect(parseSpanishBookName('Juan')).toBe('juan');
    });

    it('should parse Hechos', () => {
      expect(parseSpanishBookName('Hechos')).toBe('hechos');
    });

    it('should parse Romanos', () => {
      expect(parseSpanishBookName('Romanos')).toBe('romanos');
    });

    it('should parse 1 Corintios', () => {
      expect(parseSpanishBookName('1 Corintios')).toBe('1-corintios');
    });

    it('should parse 2 Corintios', () => {
      expect(parseSpanishBookName('2 Corintios')).toBe('2-corintios');
    });

    it('should parse Gálatas with accent', () => {
      expect(parseSpanishBookName('Gálatas')).toBe('galatas');
    });

    it('should parse Galatas without accent', () => {
      expect(parseSpanishBookName('Galatas')).toBe('galatas');
    });

    it('should parse Efesios', () => {
      expect(parseSpanishBookName('Efesios')).toBe('efesios');
    });

    it('should parse Filipenses', () => {
      expect(parseSpanishBookName('Filipenses')).toBe('filipenses');
    });

    it('should parse 1 Timoteo', () => {
      expect(parseSpanishBookName('1 Timoteo')).toBe('1-timoteo');
    });

    it('should parse 2 Timoteo', () => {
      expect(parseSpanishBookName('2 Timoteo')).toBe('2-timoteo');
    });

    it('should parse 1 Pedro', () => {
      expect(parseSpanishBookName('1 Pedro')).toBe('1-pedro');
    });

    it('should parse 2 Pedro', () => {
      expect(parseSpanishBookName('2 Pedro')).toBe('2-pedro');
    });

    it('should parse 1 Juan', () => {
      expect(parseSpanishBookName('1 Juan')).toBe('1-juan');
    });

    it('should parse 2 Juan', () => {
      expect(parseSpanishBookName('2 Juan')).toBe('2-juan');
    });

    it('should parse 3 Juan', () => {
      expect(parseSpanishBookName('3 Juan')).toBe('3-juan');
    });

    it('should parse Apocalipsis', () => {
      expect(parseSpanishBookName('Apocalipsis')).toBe('apocalipsis');
    });
  });

  describe('case insensitivity', () => {
    it('should handle uppercase', () => {
      expect(parseSpanishBookName('MATEO')).toBe('mateo');
    });

    it('should handle lowercase', () => {
      expect(parseSpanishBookName('mateo')).toBe('mateo');
    });

    it('should handle mixed case', () => {
      expect(parseSpanishBookName('MaTeO')).toBe('mateo');
    });

    it('should handle uppercase with accents', () => {
      expect(parseSpanishBookName('GÉNESIS')).toBe('genesis');
    });
  });

  describe('whitespace handling', () => {
    it('should trim leading whitespace', () => {
      expect(parseSpanishBookName('  Mateo')).toBe('mateo');
    });

    it('should trim trailing whitespace', () => {
      expect(parseSpanishBookName('Mateo  ')).toBe('mateo');
    });

    it('should trim both leading and trailing whitespace', () => {
      expect(parseSpanishBookName('  Mateo  ')).toBe('mateo');
    });
  });

  describe('invalid book names', () => {
    it('should return null for invalid book name', () => {
      expect(parseSpanishBookName('Invalid Book')).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(parseSpanishBookName('')).toBeNull();
    });

    it('should return null for gibberish', () => {
      expect(parseSpanishBookName('XYZ123')).toBeNull();
    });

    it('should return null for partial matches', () => {
      expect(parseSpanishBookName('Mat')).toBeNull();
    });
  });
});

describe('formatVerseIdForApi', () => {
  describe('single verse formatting', () => {
    it('should format single verse correctly', () => {
      const reference: Reference = {
        book: 'Mateo',
        chapter: 5,
        verseStart: 13,
        display: 'Mateo 5:13',
        translation: 'RVR60',
      };

      expect(formatVerseIdForApi(reference)).toBe('mateo/5/13');
    });

    it('should format verse with different book', () => {
      const reference: Reference = {
        book: 'Juan',
        chapter: 3,
        verseStart: 16,
        display: 'Juan 3:16',
        translation: 'RVR60',
      };

      expect(formatVerseIdForApi(reference)).toBe('juan/3/16');
    });

    it('should format verse from Old Testament', () => {
      const reference: Reference = {
        book: 'Génesis',
        chapter: 1,
        verseStart: 1,
        display: 'Génesis 1:1',
        translation: 'RVR60',
      };

      expect(formatVerseIdForApi(reference)).toBe('genesis/1/1');
    });

    it('should format verse with numbered book', () => {
      const reference: Reference = {
        book: '1 Juan',
        chapter: 4,
        verseStart: 8,
        display: '1 Juan 4:8',
        translation: 'RVR60',
      };

      expect(formatVerseIdForApi(reference)).toBe('1-juan/4/8');
    });
  });

  describe('verse range formatting', () => {
    it('should format verse range correctly', () => {
      const reference: Reference = {
        book: 'Mateo',
        chapter: 5,
        verseStart: 13,
        verseEnd: 14,
        display: 'Mateo 5:13-14',
        translation: 'RVR60',
      };

      expect(formatVerseIdForApi(reference)).toBe('mateo/5/13-14');
    });

    it('should format longer verse range', () => {
      const reference: Reference = {
        book: 'Romanos',
        chapter: 8,
        verseStart: 38,
        verseEnd: 39,
        display: 'Romanos 8:38-39',
        translation: 'RVR60',
      };

      expect(formatVerseIdForApi(reference)).toBe('romanos/8/38-39');
    });

    it('should treat verseEnd equal to verseStart as single verse', () => {
      const reference: Reference = {
        book: 'Mateo',
        chapter: 5,
        verseStart: 13,
        verseEnd: 13,
        display: 'Mateo 5:13',
        translation: 'RVR60',
      };

      expect(formatVerseIdForApi(reference)).toBe('mateo/5/13');
    });
  });

  describe('various books and chapters', () => {
    it('should format Psalms', () => {
      const reference: Reference = {
        book: 'Salmos',
        chapter: 23,
        verseStart: 1,
        display: 'Salmos 23:1',
        translation: 'RVR60',
      };

      expect(formatVerseIdForApi(reference)).toBe('salmos/23/1');
    });

    it('should format 2 Corintios', () => {
      const reference: Reference = {
        book: '2 Corintios',
        chapter: 5,
        verseStart: 17,
        display: '2 Corintios 5:17',
        translation: 'RVR60',
      };

      expect(formatVerseIdForApi(reference)).toBe('2-corintios/5/17');
    });

    it('should format Apocalipsis', () => {
      const reference: Reference = {
        book: 'Apocalipsis',
        chapter: 21,
        verseStart: 5,
        display: 'Apocalipsis 21:5',
        translation: 'RVR60',
      };

      expect(formatVerseIdForApi(reference)).toBe('apocalipsis/21/5');
    });
  });

  describe('invalid book names', () => {
    it('should return null for invalid book name', () => {
      const reference: Reference = {
        book: 'Invalid Book',
        chapter: 1,
        verseStart: 1,
        display: 'Invalid Book 1:1',
        translation: 'RVR60',
      };

      expect(formatVerseIdForApi(reference)).toBeNull();
    });

    it('should return null for empty book name', () => {
      const reference: Reference = {
        book: '',
        chapter: 1,
        verseStart: 1,
        display: '1:1',
        translation: 'RVR60',
      };

      expect(formatVerseIdForApi(reference)).toBeNull();
    });
  });
});

describe('isBookNameSupported', () => {
  it('should return true for valid book names', () => {
    expect(isBookNameSupported('Mateo')).toBe(true);
    expect(isBookNameSupported('Génesis')).toBe(true);
    expect(isBookNameSupported('1 Juan')).toBe(true);
  });

  it('should return false for invalid book names', () => {
    expect(isBookNameSupported('Invalid Book')).toBe(false);
    expect(isBookNameSupported('')).toBe(false);
    expect(isBookNameSupported('XYZ')).toBe(false);
  });

  it('should be case insensitive', () => {
    expect(isBookNameSupported('mateo')).toBe(true);
    expect(isBookNameSupported('MATEO')).toBe(true);
    expect(isBookNameSupported('MaTeO')).toBe(true);
  });
});

describe('getSupportedBookNames', () => {
  it('should return non-empty array', () => {
    const bookNames = getSupportedBookNames();
    expect(Array.isArray(bookNames)).toBe(true);
    expect(bookNames.length).toBeGreaterThan(0);
  });

  it('should contain expected book names', () => {
    const bookNames = getSupportedBookNames();
    expect(bookNames).toContain('génesis');
    expect(bookNames).toContain('mateo');
    expect(bookNames).toContain('juan');
    expect(bookNames).toContain('1 juan');
  });

  it('should have entries for books with and without accents', () => {
    const bookNames = getSupportedBookNames();
    expect(bookNames).toContain('génesis');
    expect(bookNames).toContain('genesis');
    expect(bookNames).toContain('éxodo');
    expect(bookNames).toContain('exodo');
  });

  it('should have at least 66 unique book codes', () => {
    const bookNames = getSupportedBookNames();
    const bookCodes = new Set(
      bookNames.map((name) => parseSpanishBookName(name))
    );
    // Should have 66 unique codes (66 books of the Bible)
    expect(bookCodes.size).toBeGreaterThanOrEqual(66);
  });
});
