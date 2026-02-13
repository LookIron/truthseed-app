# Patch: Create Missing Bible API Library Files

## Metadata

adw_id: `c5c51e28`
review_change_request: `Issue #1: No implementation files created - The spec requires creating src/lib/verse-parser.ts, src/lib/bible-api-client.ts, and src/lib/bible-provider-factory.ts but none of these files exist in the codebase Resolution: Create all three required library files with the functionality specified in Steps 2, 3, and 5 of the implementation plan Severity: blocker`

## Issue Summary

**Original Spec:** specs/issue-10-adw-c5c51e28-sdlc_planner-integrate-bible-api.md
**Issue:** The specification requires creating three library files (verse-parser.ts, bible-api-client.ts, and bible-provider-factory.ts) but none of these files have been created yet. These are foundational files needed for the Bible API integration.
**Solution:** Create all three required library files with full implementation as specified in Steps 2, 3, and 5 of the implementation plan, including proper TypeScript types, error handling, and comprehensive book name mappings.

## Files to Modify

Use these files to implement the patch:

**New Files:**

- `src/lib/verse-parser.ts` - Parse Spanish biblical references and convert book names to API-compatible IDs
- `src/lib/bible-api-client.ts` - HTTP client for scripture.api.bible with authentication and error handling
- `src/lib/bible-provider-factory.ts` - Factory to select between BibleApiProvider and MockBibleProvider

**Supporting Files (for reference):**

- `src/domain/models/Reference.ts` - Reference model to understand structure
- `src/infrastructure/bible/MockBibleProvider.ts` - Understand BibleProvider interface
- `src/domain/services/BibleProvider.ts` - Interface definition

## Implementation Steps

IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create verse-parser.ts with book name mappings

- Read `src/domain/models/Reference.ts` to understand the Reference type structure
- Create `src/lib/verse-parser.ts` with comprehensive Spanish book name to API code mapping
- Implement `parseSpanishBookName(bookName: string): string | null` function mapping all 66 Bible books
- Handle special cases: numbered books (1 Juan → 1JN, 2 Corintios → 2CO), books with accents (Génesis, Éxodo)
- Implement `formatVerseIdForApi(reference: Reference): string` to convert Reference objects to API format (e.g., "MAT.5.13" or "MAT.5.13-MAT.5.14" for ranges)
- Add proper TypeScript types and JSDoc comments for all exported functions
- Export helper functions for reuse throughout the application

### Step 2: Create bible-api-client.ts with API integration logic

- Read `src/lib/env.ts` to understand environment variable patterns used in the project
- Create `src/lib/bible-api-client.ts` with `BibleApiClient` class
- Add constructor accepting `baseUrl: string`, `apiKey: string`, and `bibleId: string` parameters
- Implement `fetchVerse(reference: Reference): Promise<{ text: string, translation: string } | null>` method
- Use verse-parser to convert Reference to API-compatible format before making request
- Add proper Authorization header with API key for all requests
- Implement retry logic: retry once on 5xx errors with exponential backoff (1 second delay)
- Add timeout handling: 10 seconds max per request using AbortController
- Handle all error scenarios: 404 (verse not found), 401 (invalid API key), 429 (rate limit), 500/503 (server errors), network failures
- Define TypeScript interfaces for scripture.api.bible response format (ApiVerseResponse, ApiPassage, etc.)
- Log errors for debugging but return null on failures (don't throw to allow graceful fallback)

### Step 3: Create bible-provider-factory.ts with provider selection logic

- Read `src/domain/services/BibleProvider.ts` to understand the BibleProvider interface
- Read `src/infrastructure/bible/BibleApiProvider.ts` and `src/infrastructure/bible/MockBibleProvider.ts` to understand implementation patterns
- Create `src/lib/bible-provider-factory.ts` with `createBibleProvider(): BibleProvider` function
- Read environment variables: BIBLE_API_BASE_URL, BIBLE_API_KEY, BIBLE_DEFAULT_TRANSLATION
- If all three environment variables are configured and valid (non-empty strings), instantiate and return BibleApiProvider
- If any environment variable is missing or invalid, log console warning and return MockBibleProvider instance
- Export singleton instance `bibleProvider` for consistent usage across app (prevents multiple provider instantiations)
- Add JSDoc comments explaining configuration requirements and fallback behavior
- Import and integrate with BibleApiClient from step 2

## Validation

Execute every command to validate the patch is complete with zero regressions.

1. `cd /Users/esteban.camacho/Projects/agentic-coding/code/truthseed-app/trees/c5c51e28 && pnpm typecheck` - Verify all TypeScript types are correct with zero errors
2. `cd /Users/esteban.camacho/Projects/agentic-coding/code/truthseed-app/trees/c5c51e28 && pnpm lint` - Ensure code follows project conventions with zero errors
3. `cd /Users/esteban.camacho/Projects/agentic-coding/code/truthseed-app/trees/c5c51e28 && ls -la src/lib/verse-parser.ts src/lib/bible-api-client.ts src/lib/bible-provider-factory.ts` - Confirm all three files exist
4. Manual validation: Review each file to ensure complete implementation with proper TypeScript types, error handling, and comprehensive book mappings (all 66 books)

## Patch Scope

**Lines of code to change:** ~400 lines (verse-parser.ts: ~150 lines for book mappings, bible-api-client.ts: ~200 lines, bible-provider-factory.ts: ~50 lines)
**Risk level:** low
**Testing required:** Unit tests will be created in subsequent steps of the original implementation plan. This patch focuses on creating the foundational library files with correct structure and types.
