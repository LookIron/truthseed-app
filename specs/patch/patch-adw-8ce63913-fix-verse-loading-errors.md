# Patch: Fix Bible Verse Loading Errors

## Metadata

adw_id: `8ce63913`
review_change_request: `Issue #1: Multiple Bible verses are failing to load with 'Verse not found' error. For example, Colosenses 2:10 returns 404 from the API. This means the BibleApiClient is unable to fetch verses from the docs-bible-api, making the application unusable for most truths. Resolution: Investigate why the BibleApiClient.fetchVerse() is returning null for valid verse references. Check if the book names need translation (e.g., 'Colosenses' vs 'Colossians'), or if there's an issue with the API client configuration or the docs-bible-api integration. Severity: blocker`

## Issue Summary

**Original Spec:** N/A
**Issue:** Multiple Bible verses failing to load with "Verse not found" errors and "Invalid query parameters" errors. Screenshots show:

- Colosenses 3:3 displaying "Invalid query parameters"
- 1 Corintios 6:19-20 displaying "Verse not found"
- The API is returning 404 errors for valid verse references

**Solution:** Fix the translation code format and verify the API integration. The translation code "rv1960" needs to be correctly formatted for the docs-bible-api. Additionally, ensure proper handling of null/undefined verseEnd parameter and validate the book name mapping is working correctly.

## Files to Modify

Use these files to implement the patch:

- `src/app/api/verse/route.ts` - Already has verseEnd fix, verify it's correct
- `src/content/truths.json` - Already updated translation codes, verify correctness
- `src/lib/bible-api-client.ts` - Verify API URL construction and error handling
- `src/lib/verse-parser.ts` - Verify book name mapping for Colosenses

## Implementation Steps

IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Verify and test the docs-bible-api translation code format

- Check if "rv1960" is the correct translation code for the API by testing a sample API request
- Test the API endpoint directly: `curl "https://bible-api.deno.dev/api/read/rv1960/juan/1/12"`
- If the translation code is incorrect, identify the correct format from the API documentation or by testing valid codes

### Step 2: Fix translation code if needed

- If "rv1960" is incorrect, update all references in `src/content/truths.json` to use the correct translation code
- Ensure consistency across all truth entries

### Step 3: Verify verseEnd parameter handling

- Confirm the fix in `src/app/api/verse/route.ts` line 27 (`verseEnd: searchParams.get('verseEnd') ?? undefined`) is working correctly
- Ensure the Zod schema on line 10 correctly handles optional verseEnd with `z.string().regex(/^\d+$/).optional()`

### Step 4: Test the Bible API integration end-to-end

- Start the development server with `pnpm dev`
- Navigate to the application and test verse loading for:
  - Single verses (e.g., Colosenses 2:10, Juan 1:12)
  - Verse ranges (e.g., 1 Corintios 6:19-20, Romanos 8:1-2)
- Verify no "Invalid query parameters" or "Verse not found" errors appear
- Check browser console and server logs for any API errors

## Validation

Execute every command to validate the patch is complete with zero regressions.

1. Run content validation: `pnpm validate:content`
2. Run type checking: `pnpm typecheck`
3. Run linting: `pnpm lint`
4. Run unit tests: `pnpm test:unit`
5. Build the application: `pnpm build`
6. Start the application: `pnpm dev` (verify verses load correctly in the UI)
7. Test specific verses mentioned in the issue:
   - Colosenses 2:10
   - Colosenses 3:3
   - 1 Corintios 6:19-20
   - Juan 1:12
   - Romanos 8:1-2

## Patch Scope

**Lines of code to change:** 0-5 (if translation code needs updating)
**Risk level:** low
**Testing required:** Manual testing of verse loading in UI, automated test suite, API integration testing
