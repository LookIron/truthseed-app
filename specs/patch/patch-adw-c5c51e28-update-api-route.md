# Patch: Update API Route to Use BibleApiClient

## Metadata

adw_id: `c5c51e28`
review_change_request: `Issue #2: API route not updated - The spec requires updating src/app/api/verse/route.ts to use BibleApiClient instead of returning mock data, but the file was not modified in this branch Resolution: Update the API route handler as described in Step 6 of the implementation plan to fetch real Bible verses from scripture.api.bible Severity: blocker`

## Issue Summary

**Original Spec:** specs/issue-10-adw-c5c51e28-sdlc_planner-integrate-bible-api.md
**Issue:** The API route handler at src/app/api/verse/route.ts still returns mock data (lines 63-74) instead of using the newly created BibleApiClient to fetch real Bible verses from scripture.api.bible.
**Solution:** Replace the mock response code with actual API calls using BibleApiClient, implement fallback to MockBibleProvider on errors, and ensure proper caching headers are maintained.

## Files to Modify

Use these files to implement the patch:

- **src/app/api/verse/route.ts** - Replace mock data with BibleApiClient integration

## Implementation Steps

IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Update API route to use BibleApiClient

- Import BibleApiClient from `@/lib/bible-api-client`
- Import formatVerseIdForApi from `@/lib/verse-parser`
- Create BibleApiClient instance using environment variables (baseUrl, apiKey, translation)
- Replace mock response code (lines 55-100) with actual API call using `client.fetchVerse()`
- Construct Reference object from validated query parameters
- Call BibleApiClient to fetch real verse text
- Return the fetched verse with the same response format as the mock

### Step 2: Implement fallback to MockBibleProvider

- Import MockBibleProvider from `@/infrastructure/bible/MockBibleProvider`
- If BibleApiClient returns null (API error or verse not found), create MockBibleProvider instance
- Call MockBibleProvider.fetchVerse() as fallback
- If both API and Mock fail, return appropriate error response
- Maintain existing Cache-Control headers for successful responses

## Validation

Execute every command to validate the patch is complete with zero regressions.

- `cd /Users/esteban.camacho/Projects/agentic-coding/code/truthseed-app/trees/c5c51e28 && pnpm typecheck` - Verify TypeScript compilation succeeds with zero errors
- `cd /Users/esteban.camacho/Projects/agentic-coding/code/truthseed-app/trees/c5c51e28 && pnpm lint` - Verify ESLint passes with zero warnings or errors
- `cd /Users/esteban.camacho/Projects/agentic-coding/code/truthseed-app/trees/c5c51e28 && pnpm build` - Verify production build succeeds
- `cd /Users/esteban.camacho/Projects/agentic-coding/code/truthseed-app/trees/c5c51e28 && pnpm test:unit` - Verify all unit tests pass
- Manual validation: Test API route with valid reference to verify it fetches real verse (if API key configured) or falls back to mock gracefully

## Patch Scope

**Lines of code to change:** ~50 lines (replace mock implementation with real API integration)
**Risk level:** medium (core API functionality, but well-defined fallback behavior)
**Testing required:** Type checking, linting, build verification, unit tests, manual API endpoint testing
