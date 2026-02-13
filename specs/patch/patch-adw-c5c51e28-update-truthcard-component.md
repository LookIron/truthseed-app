# Patch: Update TruthCard Component to Use Provider Factory

## Metadata

adw_id: `c5c51e28`
review_change_request: `Issue #3: TruthCard component not updated - The spec requires updating src/components/TruthCard.tsx to use the provider factory instead of MockBibleProvider, but the file was not modified Resolution: Update TruthCard component as described in Step 7 to use the bible-provider-factory Severity: blocker`

## Issue Summary

**Original Spec:** specs/issue-10-adw-c5c51e28-sdlc_planner-integrate-bible-api.md
**Issue:** The TruthCard component still directly instantiates MockBibleProvider instead of using the bible-provider-factory that was created. This prevents the component from using the real Bible API when configured.
**Solution:** Replace the hardcoded `new MockBibleProvider()` instantiation in TruthCard.tsx with the `bibleProvider` singleton from bible-provider-factory.ts, as specified in Step 7 of the original spec.

## Files to Modify

Use these files to implement the patch:

- `src/components/TruthCard.tsx` - Update to use provider factory instead of MockBibleProvider

## Implementation Steps

IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Update TruthCard component imports

- Remove the import of `MockBibleProvider` from line 6
- Add import of `bibleProvider` from `@/lib/bible-provider-factory`

### Step 2: Replace provider instantiation

- Remove line 27: `const bibleProvider = new MockBibleProvider();`
- The component will now use the imported `bibleProvider` singleton from the factory
- Keep all existing caching logic with IndexedDBCache unchanged
- Keep all existing error handling and loading states unchanged

## Validation

Execute every command to validate the patch is complete with zero regressions.

- `cd /Users/esteban.camacho/Projects/agentic-coding/code/truthseed-app/trees/c5c51e28 && pnpm typecheck` - Verify TypeScript types are correct
- `cd /Users/esteban.camacho/Projects/agentic-coding/code/truthseed-app/trees/c5c51e28 && pnpm lint` - Verify code follows project conventions
- `cd /Users/esteban.camacho/Projects/agentic-coding/code/truthseed-app/trees/c5c51e28 && pnpm build` - Verify production build succeeds
- Manual validation: Start the app and verify verses are displayed correctly using the configured provider

## Patch Scope

**Lines of code to change:** 2-3
**Risk level:** low
**Testing required:** TypeScript type checking, linting, and build validation to ensure the import and usage are correct
