# Patch: Remove explicit pnpm version from CI workflow

## Metadata

adw_id: `974f08ca`
review_change_request: `Issue #1: The primary fix specified in the spec was not implemented. The .github/workflows/ci.yml file still contains 'version: 10' on lines 26 and 101 in both the 'test' and 'lint-commits' jobs. According to the spec, these explicit version specifications should have been removed to allow the pnpm action to auto-detect the version from package.json's packageManager field (pnpm@10.17.0). The git diff shows no changes to the CI workflow file at all. Resolution: Remove the 'version: 10' parameter from both pnpm setup steps in .github/workflows/ci.yml (lines 24-26 and 98-101). Change from 'uses: pnpm/action-setup@v4
with:
  version: 10' to just 'uses: pnpm/action-setup@v4' without the with/version block. This will allow pnpm action to use the version specified in package.json. Severity: blocker`

## Issue Summary

**Original Spec:** Not provided
**Issue:** The CI workflow file (.github/workflows/ci.yml) still contains explicit `version: 10` configuration in both the 'test' job (lines 24-26) and 'lint-commits' job (lines 98-101). This prevents the pnpm action from auto-detecting the version from package.json's packageManager field (pnpm@10.17.0).
**Solution:** Remove the `with: version: 10` block from both pnpm setup steps, allowing pnpm/action-setup@v4 to automatically detect and use the version specified in package.json.

## Files to Modify

- `.github/workflows/ci.yml` - Remove explicit pnpm version configuration from both jobs

## Implementation Steps

IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Remove pnpm version from test job

- Edit `.github/workflows/ci.yml` lines 23-26
- Change from:
  ```yaml
  - name: Setup pnpm
    uses: pnpm/action-setup@v4
    with:
      version: 10
  ```
- Change to:
  ```yaml
  - name: Setup pnpm
    uses: pnpm/action-setup@v4
  ```

### Step 2: Remove pnpm version from lint-commits job

- Edit `.github/workflows/ci.yml` lines 98-101
- Change from:
  ```yaml
  - name: Setup pnpm
    uses: pnpm/action-setup@v4
    with:
      version: 10
  ```
- Change to:
  ```yaml
  - name: Setup pnpm
    uses: pnpm/action-setup@v4
  ```

## Validation

Execute every command to validate the patch is complete with zero regressions.

1. Verify the changes in the CI workflow file:

   ```bash
   git diff .github/workflows/ci.yml
   ```

2. Confirm package.json has the correct packageManager field:

   ```bash
   grep packageManager package.json
   ```

   Expected: `"packageManager": "pnpm@10.17.0",`

3. Validate CI workflow syntax:

   ```bash
   cat .github/workflows/ci.yml | grep -A 2 "Setup pnpm"
   ```

   Expected: Both occurrences should show only `uses: pnpm/action-setup@v4` without a `with:` block

4. Run local validation tests to ensure no regressions:
   ```bash
   pnpm validate:content && pnpm typecheck && pnpm lint && pnpm test:unit && pnpm build
   ```

## Patch Scope

**Lines of code to change:** 4 lines removed (2 occurrences of `with:` and `version: 10`)
**Risk level:** low
**Testing required:** Verify CI workflow file changes and run full local test suite to ensure no regressions
