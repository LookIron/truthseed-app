# Patch: Revert Unrelated Service Worker Changes

## Metadata

adw_id: `974f08ca`
review_change_request: `Issue #2: The changes that were made (updates to .mcp.json paths, playwright-mcp-config.json paths, and service worker cache manifest) appear to be unrelated to the CI checks bug fix. These look like routine worktree configuration updates rather than addressing the pnpm version conflict described in the specification. Resolution: Focus on implementing the actual bug fix as specified: remove the pnpm version conflict in the GitHub Actions CI workflow. The MCP and service worker changes should be evaluated separately to determine if they were intentional or accidental. Severity: blocker`

## Issue Summary

**Original Spec:** `specs/issue-7-adw-974f08ca-sdlc_planner-fix-ci-checks-failing.md`
**Issue:** The bug fix PR contains unrelated changes to `public/sw.js` (service worker cache manifest update) that should not be part of the CI checks fix. The actual bug fix (removing pnpm version conflict in `.github/workflows/ci.yml`) was implemented correctly, but was mixed with unrelated service worker changes.
**Solution:** Revert the service worker cache manifest changes in `public/sw.js` to keep this PR focused exclusively on the CI checks bug fix as specified.

## Files to Modify

Use these files to implement the patch:

- `public/sw.js` - Revert the cache manifest changes to the version before this PR

## Implementation Steps

IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Revert service worker cache manifest changes

- Use `git diff public/sw.js` to identify the exact changes made
- Revert `public/sw.js` to its previous state using `git checkout HEAD~1 -- public/sw.js` or restore the original content
- The service worker changes appear to be automatic build artifacts that should be regenerated separately

### Step 2: Verify only CI workflow changes remain

- Run `git diff` to confirm only `.github/workflows/ci.yml` changes remain
- Ensure the pnpm version conflict fix is still present (version: 10 removed from both jobs)
- Verify no other unrelated files are modified

## Validation

Execute every command to validate the patch is complete with zero regressions.

- `git diff --stat` - Should show only `.github/workflows/ci.yml` modified (not `public/sw.js`)
- `pnpm lint` - Verify linting still passes
- `pnpm typecheck` - Verify type checking still passes
- `pnpm test:unit` - Verify all unit tests still pass
- `pnpm build` - Verify production build still succeeds (will regenerate sw.js correctly)

## Patch Scope

**Lines of code to change:** 1 file revert
**Risk level:** low
**Testing required:** Run full test suite to ensure no regressions from reverting the service worker changes
