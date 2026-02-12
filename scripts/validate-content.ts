#!/usr/bin/env tsx

/**
 * Validates the truths.json content file against Zod schemas
 * Run with: pnpm validate:content
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { TruthsFileSchema } from '../src/domain/models/Truth';

const TRUTHS_FILE_PATH = join(process.cwd(), 'src', 'content', 'truths.json');

function validateTruths(): void {
  console.log('🔍 Validating truths.json...\n');

  try {
    // Read the file
    const fileContent = readFileSync(TRUTHS_FILE_PATH, 'utf-8');
    const data = JSON.parse(fileContent);

    // Validate against schema
    const result = TruthsFileSchema.safeParse(data);

    if (!result.success) {
      console.error('❌ Validation failed:\n');
      console.error(result.error.format());
      process.exit(1);
    }

    // Additional validation checks
    const truths = result.data.truths;
    const ids = new Set<string>();
    const duplicates: string[] = [];

    truths.forEach((truth) => {
      if (ids.has(truth.id)) {
        duplicates.push(truth.id);
      }
      ids.add(truth.id);
    });

    if (duplicates.length > 0) {
      console.error('❌ Duplicate IDs found:');
      duplicates.forEach((id) => console.error(`  - ${id}`));
      process.exit(1);
    }

    // Success!
    console.log('✅ Validation successful!');
    console.log(`\n📊 Statistics:`);
    console.log(`   Total truths: ${truths.length}`);
    console.log(
      `   Categories: ${new Set(truths.map((t) => t.category)).size}`
    );
    console.log(
      `   Total references: ${truths.reduce((sum, t) => sum + t.references.length, 0)}`
    );
    console.log('\n✨ All truths are valid and ready to use!\n');
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Error reading or parsing file:');
      console.error(error.message);
    } else {
      console.error('❌ Unknown error occurred');
    }
    process.exit(1);
  }
}

// Run validation
validateTruths();
