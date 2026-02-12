import { z } from 'zod';
import { ReferenceSchema } from './Reference';

/**
 * Category types for truths
 */
export const TruthCategory = z.enum([
  'accepted',
  'secure',
  'significant',
  'identity',
  'freedom',
  'loved',
]);

export type TruthCategoryType = z.infer<typeof TruthCategory>;

/**
 * Zod schema for Truth validation
 */
export const TruthSchema = z.object({
  id: z
    .string()
    .min(1, 'ID is required')
    .regex(/^[a-z0-9-]+$/, 'ID must be lowercase with hyphens'),
  title: z.string().min(1, 'Title is required'),
  renounceStatement: z
    .string()
    .min(1, 'Renounce statement is required')
    .describe('Statement that renounces the lie and affirms the truth'),
  category: TruthCategory,
  references: z
    .array(ReferenceSchema)
    .min(1, 'At least one reference is required')
    .describe('Biblical references supporting this truth'),
  tags: z
    .array(z.string())
    .optional()
    .default([])
    .describe('Optional tags for categorization and search'),
});

/**
 * TypeScript type inferred from Zod schema
 */
export type Truth = z.infer<typeof TruthSchema>;

/**
 * Schema for the truths.json file structure
 */
export const TruthsFileSchema = z.object({
  truths: z.array(TruthSchema),
});

export type TruthsFile = z.infer<typeof TruthsFileSchema>;
