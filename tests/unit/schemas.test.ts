import { describe, it, expect } from 'vitest';
import { ReferenceSchema } from '@/domain/models/Reference';
import { TruthSchema, TruthsFileSchema } from '@/domain/models/Truth';
import truthsData from '@/content/truths.json';

describe('Reference Schema', () => {
  it('should validate a correct reference', () => {
    const validReference = {
      book: 'Juan',
      chapter: 1,
      verseStart: 12,
      display: 'Juan 1:12',
      translation: 'RVR60',
    };

    const result = ReferenceSchema.safeParse(validReference);
    expect(result.success).toBe(true);
  });

  it('should validate a reference with verse range', () => {
    const validReference = {
      book: 'Romanos',
      chapter: 8,
      verseStart: 38,
      verseEnd: 39,
      display: 'Romanos 8:38-39',
      translation: 'RVR60',
    };

    const result = ReferenceSchema.safeParse(validReference);
    expect(result.success).toBe(true);
  });

  it('should reject reference with missing required fields', () => {
    const invalidReference = {
      book: 'Juan',
      chapter: 1,
      // missing verseStart and display
    };

    const result = ReferenceSchema.safeParse(invalidReference);
    expect(result.success).toBe(false);
  });

  it('should reject reference with invalid chapter', () => {
    const invalidReference = {
      book: 'Juan',
      chapter: -1,
      verseStart: 12,
      display: 'Juan 1:12',
      translation: 'RVR60',
    };

    const result = ReferenceSchema.safeParse(invalidReference);
    expect(result.success).toBe(false);
  });

  it('should use default translation if not provided', () => {
    const reference = {
      book: 'Juan',
      chapter: 1,
      verseStart: 12,
      display: 'Juan 1:12',
    };

    const result = ReferenceSchema.safeParse(reference);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.translation).toBe('RVR60');
    }
  });
});

describe('Truth Schema', () => {
  it('should validate a correct truth', () => {
    const validTruth = {
      id: 'test-truth',
      title: 'Test Truth',
      renounceStatement: 'I renounce the lie.',
      category: 'accepted',
      references: [
        {
          book: 'Juan',
          chapter: 1,
          verseStart: 12,
          display: 'Juan 1:12',
          translation: 'RVR60',
        },
      ],
      tags: ['test'],
    };

    const result = TruthSchema.safeParse(validTruth);
    expect(result.success).toBe(true);
  });

  it('should reject truth with invalid ID format', () => {
    const invalidTruth = {
      id: 'Invalid_ID_With_Underscores',
      title: 'Test Truth',
      renounceStatement: 'I renounce the lie.',
      category: 'accepted',
      references: [
        {
          book: 'Juan',
          chapter: 1,
          verseStart: 12,
          display: 'Juan 1:12',
          translation: 'RVR60',
        },
      ],
    };

    const result = TruthSchema.safeParse(invalidTruth);
    expect(result.success).toBe(false);
  });

  it('should reject truth without references', () => {
    const invalidTruth = {
      id: 'test-truth',
      title: 'Test Truth',
      renounceStatement: 'I renounce the lie.',
      category: 'accepted',
      references: [],
    };

    const result = TruthSchema.safeParse(invalidTruth);
    expect(result.success).toBe(false);
  });

  it('should use empty array for tags if not provided', () => {
    const truth = {
      id: 'test-truth',
      title: 'Test Truth',
      renounceStatement: 'I renounce the lie.',
      category: 'accepted',
      references: [
        {
          book: 'Juan',
          chapter: 1,
          verseStart: 12,
          display: 'Juan 1:12',
          translation: 'RVR60',
        },
      ],
    };

    const result = TruthSchema.safeParse(truth);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toEqual([]);
    }
  });
});

describe('Truths File Validation', () => {
  it('should validate the actual truths.json file', () => {
    const result = TruthsFileSchema.safeParse(truthsData);
    expect(result.success).toBe(true);
  });

  it('should have unique truth IDs', () => {
    const ids = new Set(truthsData.truths.map((t) => t.id));
    expect(ids.size).toBe(truthsData.truths.length);
  });

  it('should have valid category for each truth', () => {
    const validCategories = [
      'accepted',
      'secure',
      'significant',
      'identity',
      'freedom',
      'loved',
    ];

    truthsData.truths.forEach((truth) => {
      expect(validCategories).toContain(truth.category);
    });
  });

  it('should have at least one reference per truth', () => {
    truthsData.truths.forEach((truth) => {
      expect(truth.references.length).toBeGreaterThan(0);
    });
  });
});
