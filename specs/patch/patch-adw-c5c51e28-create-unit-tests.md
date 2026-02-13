# Patch: Create Missing Unit Tests for Bible API Libraries

## Metadata

adw_id: `c5c51e28`
review_change_request: `Issue #4: No unit tests created - The spec requires unit tests in tests/unit/verse-parser.test.ts and tests/unit/bible-api-client.test.ts but these files do not exist Resolution: Create comprehensive unit tests as described in Steps 2 and 4 of the implementation plan Severity: blocker`

## Issue Summary

**Original Spec:** specs/issue-10-adw-c5c51e28-sdlc_planner-integrate-bible-api.md
**Issue:** The specification requires creating comprehensive unit tests for verse-parser.ts (Step 2) and bible-api-client.ts (Step 4), but neither tests/unit/verse-parser.test.ts nor tests/unit/bible-api-client.test.ts exist.
**Solution:** Create both unit test files with comprehensive test coverage as specified in Steps 2 and 4 of the implementation plan, covering all 66 Bible books, edge cases, error scenarios, and retry logic.

## Files to Modify

Use these files to implement the patch:

**New Files:**

- `tests/unit/verse-parser.test.ts` - Unit tests for verse reference parsing logic
- `tests/unit/bible-api-client.test.ts` - Unit tests for API client with mocked fetch

**Reference Files:**

- `src/lib/verse-parser.ts` - Implementation to test
- `src/lib/bible-api-client.ts` - Implementation to test
- `tests/unit/schemas.test.ts` - Example test structure pattern
- `tests/unit/WebSpeechService.test.ts` - Example mocking pattern

## Implementation Steps

IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create verse-parser.test.ts with comprehensive coverage

- Create `tests/unit/verse-parser.test.ts` following vitest testing patterns from existing test files
- Test `parseSpanishBookName()` function:
  - All 66 Bible books (sample at least 10-15 books from Old and New Testament)
  - Numbered books: "1 Juan" → "1JN", "2 Corintios" → "2CO", "1 Samuel" → "1SA", "2 Pedro" → "2PE"
  - Books with accents: "Génesis" → "GEN", "Éxodo" → "EXO", "Números" → "NUM"
  - Books without accents: "Genesis" → "GEN", "Exodo" → "EXO", "Numeros" → "NUM"
  - Invalid book names return null
  - Case insensitive handling (uppercase, lowercase, mixed case)
- Test `formatVerseIdForApi()` function:
  - Single verse: Reference(Mateo, 5, 13) → "MAT.5.13"
  - Verse range: Reference(Mateo, 5, 13, 14) → "MAT.5.13-MAT.5.14"
  - Verse range where verseEnd equals verseStart (treat as single verse)
  - Invalid book name returns null
  - Various books and chapter/verse combinations
- Test `isBookNameSupported()` helper function
- Test `getSupportedBookNames()` helper function (verify it returns non-empty array)
- Use descriptive test names and organize into describe blocks by function

### Step 2: Create bible-api-client.test.ts with mocked fetch

- Create `tests/unit/bible-api-client.test.ts` following vitest mocking patterns
- Set up global fetch mock using `vi.spyOn(global, 'fetch')`
- Test successful verse fetch:
  - Mock successful API response with proper JSON structure (ApiVerseResponse format)
  - Verify verse text is extracted and HTML tags are stripped
  - Verify translation ID is returned correctly
  - Verify proper Authorization header is sent with API key
  - Test both single verses and verse ranges
- Test error scenarios:
  - 404 response (verse not found) - should return null
  - 401 response (invalid API key) - should return null
  - 429 response (rate limit exceeded) - should return null
  - 500 response (server error) - should trigger retry then return null if retry fails
  - 503 response (service unavailable) - should trigger retry then return null if retry fails
  - Network error (fetch throws) - should return null
  - Timeout (abort signal triggered) - should return null after 10 seconds
- Test retry logic:
  - Verify 5xx errors trigger one retry with 1 second delay
  - Verify 4xx errors do NOT trigger retries
  - Verify successful retry returns verse data
  - Verify failed retry returns null
- Test edge cases:
  - Invalid book name (formatVerseIdForApi returns null) - should return null immediately
  - Empty response content - should return null
  - Malformed JSON response - should handle gracefully
- Use `beforeEach` to reset mocks and `afterEach` to clean up
- Mock setTimeout for retry delay testing (use `vi.useFakeTimers()`)

## Validation

Execute every command to validate the patch is complete with zero regressions.

1. `cd /Users/esteban.camacho/Projects/agentic-coding/code/truthseed-app/trees/c5c51e28 && pnpm test:unit` - Run all unit tests to verify both new test files pass
2. `cd /Users/esteban.camacho/Projects/agentic-coding/code/truthseed-app/trees/c5c51e28 && pnpm test:coverage` - Generate coverage report to verify >80% coverage for verse-parser and bible-api-client modules
3. `cd /Users/esteban.camacho/Projects/agentic-coding/code/truthseed-app/trees/c5c51e28 && pnpm typecheck` - Verify TypeScript types are correct with zero errors
4. `cd /Users/esteban.camacho/Projects/agentic-coding/code/truthseed-app/trees/c5c51e28 && pnpm lint` - Ensure test code follows project conventions
5. Manual validation: Review test output to confirm comprehensive coverage of all edge cases and error scenarios

## Patch Scope

**Lines of code to change:** ~450 lines (verse-parser.test.ts: ~200 lines, bible-api-client.test.ts: ~250 lines)
**Risk level:** low (only adding tests, no implementation changes)
**Testing required:** Run new unit tests to verify they pass and achieve >80% coverage target for the verse-parser and bible-api-client modules
