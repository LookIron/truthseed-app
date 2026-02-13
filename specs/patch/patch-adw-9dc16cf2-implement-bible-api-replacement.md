# Patch: Implement Bible API Replacement

## Metadata

adw_id: `9dc16cf2`
review_change_request: `Issue #1: No implementation work completed. The spec file describes 12 detailed steps to replace the Bible API integration (updating bible-api-client.ts, verse-parser.ts, env.ts, route.ts, removing MockBibleProvider, updating tests, etc.), but none of these code changes exist in the git diff. Only configuration files (.mcp.json, playwright-mcp-config.json, sw.js) were updated with path references. Resolution: Execute all 12 steps in the spec file to implement the Bible API replacement. This includes updating the API client, parser, environment config, provider factory, API routes, unit tests, and documentation as detailed in the spec. Severity: blocker`

## Issue Summary

**Original Spec:** specs/issue-12-adw-9dc16cf2-chore-replace-bible-library.md
**Issue:** The specification was created but no implementation work was completed. All core files (bible-api-client.ts, verse-parser.ts, env.ts, route.ts) still use the old scripture.api.bible API format requiring authentication. MockBibleProvider still exists. Tests still expect the old API format. No actual code changes were made to implement the docs-bible-api replacement.
**Solution:** Execute all 12 steps from the original spec to completely replace scripture.api.bible with docs-bible-api. Update API client, parser, environment config, provider factory, API routes, delete MockBibleProvider, update all unit tests, and update documentation to use the new free API that requires no authentication.

## Files to Modify

Use these files to implement the patch:

- src/lib/verse-parser.ts (193 lines) - Update SPANISH_BOOK_MAP to return lowercase Spanish names; update formatVerseIdForApi to return path format
- src/lib/bible-api-client.ts (241 lines) - Replace with docs-bible-api implementation (no auth, array response format)
- src/lib/env.ts (58 lines) - Remove baseUrl and apiKey from config
- src/lib/bible-provider-factory.ts (75 lines) - Remove MockBibleProvider fallback
- src/infrastructure/bible/BibleApiProvider.ts (96 lines) - Remove baseUrl and apiKey from constructor
- src/app/api/verse/route.ts (132 lines) - Remove env checks and MockBibleProvider fallback
- tests/unit/verse-parser.test.ts (430 lines) - Update all expected outputs to new format
- tests/unit/bible-api-client.test.ts (719 lines) - Update mock responses to docs-bible-api format
- .env.sample (88 lines) - Remove BIBLE_API_BASE_URL and BIBLE_API_KEY
- README.md (601 lines) - Remove API key configuration section

**Files to Delete:**

- src/infrastructure/bible/MockBibleProvider.ts (89 lines)

## Implementation Steps

IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Update verse-parser for docs-bible-api format

- Update `SPANISH_BOOK_MAP` to return lowercase Spanish book names instead of API codes:
  - "mateo" instead of "MAT", "juan" instead of "JHN", "romanos" instead of "ROM"
  - Numbered books: "1-juan" instead of "1JN", "2-corintios" instead of "2CO"
- Update `formatVerseIdForApi()` to return path format:
  - Single verse: "mateo/5/13" instead of "MAT.5.13"
  - Verse range: "mateo/5/13-14" instead of "MAT.5.13-MAT.5.14"
- Update JSDoc comments to reflect docs-bible-api format

### Step 2: Update BibleApiClient for docs-bible-api

- Change base URL to `https://bible-api.deno.dev/api/read`
- Remove `apiKey` parameter from constructor (keep `baseUrl` optional and `bibleId` as translation)
- Remove `api-key` header from fetch requests
- Update URL construction: `${baseUrl}/${translation}/${verseId}`
- Update response parsing for docs-bible-api array format:
  - Response is array of objects with `verse`, `number`, `study`, `id` fields
  - Extract `verse` field from each object and join with spaces
- Remove 401 authentication error handling
- Update JSDoc comments and interfaces

### Step 3: Update environment configuration

- Update `getBibleApiConfig()` to return only `{ defaultTranslation: 'nvi' }`
- Update `isBibleApiConfigured()` to always return `true`
- Update JSDoc comments

### Step 4: Simplify bible-provider-factory

- Update `createBibleProvider()` to always return `BibleApiProvider`
- Remove configuration checks and MockBibleProvider fallback
- Remove console.warn about missing configuration
- Update BibleApiProvider instantiation to not pass baseUrl and apiKey

### Step 5: Update BibleApiProvider

- Remove `baseUrl` and `apiKey` parameters from constructor
- Update `isConfigured()` to always return `true`
- Remove configuration check from `fetchVerse()` method
- Update JSDoc comments

### Step 6: Update API route for new response format

- Remove environment variable checks for BIBLE_API_BASE_URL and BIBLE_API_KEY
- Remove fallback to MockBibleProvider
- Update BibleApiClient instantiation to not pass baseUrl and apiKey
- Update error responses to remove API configuration references

### Step 7: Delete MockBibleProvider

- Delete file `src/infrastructure/bible/MockBibleProvider.ts`

### Step 8: Update unit tests for bible-api-client

- Update mock responses to docs-bible-api format (array of objects with `verse`, `number`, `id`)
- Remove authentication tests and 401 error tests
- Update constructor instantiation to not pass apiKey
- Keep timeout, retry, and HTML cleaning tests

### Step 9: Update unit tests for verse-parser

- Update all expected outputs to new format:
  - Book codes: "mateo" instead of "MAT"
  - Numbered books: "1-juan" instead of "1JN"
  - Verse IDs: "mateo/5/13" instead of "MAT.5.13"
  - Verse ranges: "mateo/5/13-14" instead of "MAT.5.13-MAT.5.14"

### Step 10: Update environment sample file

- Remove BIBLE_API_BASE_URL and BIBLE_API_KEY variables
- Update BIBLE_DEFAULT_TRANSLATION to default to "nvi"
- Add note that no API key is required
- Remove API rate limiting notes

### Step 11: Update README documentation

- Remove "Configure Bible API" section about getting API keys
- Add brief section about docs-bible-api (free, no authentication required)
- Update environment variables table to remove BIBLE_API_BASE_URL and BIBLE_API_KEY
- Remove troubleshooting section for Bible API errors
- Update acknowledgments to reference docs-bible-api

### Step 12: Run validation commands

- Execute `pnpm typecheck` - verify no type errors
- Execute `pnpm lint` - verify no linting errors
- Execute `pnpm test:unit` - verify all unit tests pass with new format
- Execute `pnpm build` - verify production build succeeds
- Execute `pnpm test:e2e` - verify Bible verses display correctly (real text, not "Mock verse not found")

## Validation

Execute every command to validate the patch is complete with zero regressions.

1. `pnpm typecheck` - Verify TypeScript compilation succeeds
2. `pnpm lint` - Verify ESLint passes
3. `pnpm test:unit` - Verify all unit tests pass with new API format
4. `pnpm build` - Verify production build succeeds
5. `pnpm test:e2e` - Verify Bible verses display correctly in the app

## Patch Scope

**Lines of code to change:** ~2000 lines (complete replacement of API integration logic)
**Risk level:** high
**Testing required:** Full unit test suite update, E2E tests to verify real verses display, manual testing of multiple verse references and books
