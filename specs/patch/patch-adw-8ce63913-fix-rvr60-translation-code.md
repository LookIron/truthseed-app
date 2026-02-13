# Patch: Fix RVR60 Translation Code to rv1960

## Metadata

adw_id: `8ce63913`
review_change_request: `Issue #2: Unsupported translation code: All references in src/content/truths.json still use 'RVR60' translation code, but the docs-bible-api only supports 'rv1960'. API testing confirms that requests with 'RVR60' return 'Verse not found' error (404), while 'rv1960' works correctly and returns verse text. The spec required updating all 34 occurrences of 'RVR60' to 'rv1960' in the truths.json file, but this was not done. Resolution: Find and replace all 'RVR60' with 'rv1960' in src/content/truths.json (34 occurrences). Use command: sed -i '' 's/"RVR60"/"rv1960"/g' src/content/truths.json Severity: blocker`

## Issue Summary

**Original Spec:** specs/bug/bug-adw-8ce63913-fix-verse-display-params.md (inferred)
**Issue:** All 34 references in src/content/truths.json use 'RVR60' translation code, which is not supported by the docs-bible-api. API returns 404 "Verse not found" error for 'RVR60' requests, but works correctly with 'rv1960'.
**Solution:** Replace all 34 occurrences of "RVR60" with "rv1960" in src/content/truths.json using find and replace operation.

## Files to Modify

- `src/content/truths.json` - Replace all "RVR60" with "rv1960" (34 occurrences)

## Implementation Steps

IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Replace all RVR60 with rv1960 in truths.json

- Execute: `sed -i '' 's/"RVR60"/"rv1960"/g' src/content/truths.json`
- This will update all 34 occurrences of the unsupported translation code

### Step 2: Verify the replacement was successful

- Execute: `grep -c '"rv1960"' src/content/truths.json` (should return 34)
- Execute: `grep -c '"RVR60"' src/content/truths.json` (should return 0)

## Validation

Execute every command to validate the patch is complete with zero regressions.

1. Verify translation code replacement: `grep '"translation":' src/content/truths.json | head -10`
2. Confirm all RVR60 are replaced: `grep -c '"RVR60"' src/content/truths.json` (expect: 0)
3. Confirm all rv1960 are present: `grep -c '"rv1960"' src/content/truths.json` (expect: 34)
4. Run E2E test for Bible verse display: `bun run test:e2e:test_bible_verse_display`
5. Start the app and verify verse display works: Navigate to any truth and verify the Bible verse loads correctly without 404 errors

## Patch Scope

**Lines of code to change:** 34
**Risk level:** low
**Testing required:** E2E test for Bible verse display functionality to confirm API requests now succeed with rv1960 translation code
