# Patch: Implement Translation Selector UI Component

## Metadata

adw_id: `8ce63913`
review_change_request: `Issue #2: The translation selector UI component was not implemented as specified in the requirements. The spec requires a dropdown component in the UI to allow users to choose their preferred Bible translation (rv1960, rv1995, nvi, dhh, pdt, kjv) with localStorage persistence. No TranslationSelector component was created and no UI element exists for users to change translations. Resolution: Create the TranslationSelector.tsx component as specified in the requirements, integrate it into TruthCard.tsx, and implement localStorage persistence for the user's translation preference. This is a critical feature for user experience. Severity: blocker`

## Issue Summary

**Original Spec:** Not provided - implementing from review change request
**Issue:** The translation selector UI component was not implemented. Users cannot choose their preferred Bible translation (rv1960, rv1995, nvi, dhh, pdt, kjv) and no localStorage persistence exists for translation preferences.
**Solution:** Create TranslationSelector.tsx component with dropdown UI, integrate into TruthCard.tsx, implement localStorage persistence, and ensure translation preference is used when fetching verses.

## Files to Modify

Use these files to implement the patch:

- `src/components/TranslationSelector.tsx` (create new)
- `src/components/TruthCard.tsx` (modify to integrate selector and use selected translation)
- `src/lib/translation-storage.ts` (create new for localStorage persistence)

## Implementation Steps

IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create localStorage persistence utility

- Create `src/lib/translation-storage.ts` with functions to get/set translation preference
- Default translation should be 'rv1960' if not set
- Use localStorage key 'truthseed:bible:translation'

### Step 2: Create TranslationSelector component

- Create `src/components/TranslationSelector.tsx` with dropdown UI
- Support translations: rv1960, rv1995, nvi, dhh, pdt, kjv
- Use localStorage utility to persist selected translation
- Style consistent with existing TruthCard UI (matching reference section)
- Include Spanish labels for each translation

### Step 3: Integrate TranslationSelector into TruthCard

- Import TranslationSelector and translation storage utility into TruthCard.tsx
- Add TranslationSelector above the Biblical Reference section
- Update fetchVerse to use selected translation from localStorage
- Pass selected translation to the reference when fetching verses

### Step 4: Update Reference model usage

- Ensure the translation field in Reference model is properly used
- The bible-api-client already supports translation parameter via reference.translation
- Verify translation is passed through correctly to API calls

## Validation

Execute every command to validate the patch is complete with zero regressions.

```bash
# Type check
pnpm typecheck

# Lint check
pnpm lint

# Unit tests
pnpm test:unit

# Build verification
pnpm build
```

**Manual validation:**

1. Start dev server: `pnpm dev`
2. Navigate to home page and view a truth
3. Verify TranslationSelector dropdown is visible above Biblical Reference
4. Select different translation and verify it's persisted in localStorage
5. Navigate to another truth and verify selected translation is used
6. Refresh page and verify translation selection persists
7. Verify verse text updates when translation changes

## Patch Scope

**Lines of code to change:** ~150 lines total (80 new in TranslationSelector, 30 new in translation-storage, 40 modifications in TruthCard)
**Risk level:** low
**Testing required:** Manual testing of UI component, localStorage persistence, and verse fetching with selected translation
