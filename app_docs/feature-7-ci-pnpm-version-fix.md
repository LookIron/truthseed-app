# CI Checks: Fix pnpm Version Conflict

**ADW ID:** 7
**Date:** 2026-02-12
**Specification:** specs/issue-7-adw-974f08ca-sdlc_planner-fix-ci-checks-failing.md

## Overview

Fixed GitHub Actions CI checks that were always failing due to a pnpm version conflict between the workflow configuration and package.json. The fix removes the explicit version specification from the CI workflow, allowing the pnpm action to automatically use the version specified in package.json's packageManager field.

## What Was Built

- Fixed pnpm version mismatch in GitHub Actions CI workflow
- Enabled all CI checks to run and pass correctly when code is valid
- Ensured single source of truth for pnpm version (package.json)

## Technical Implementation

### Files Modified

- `.github/workflows/ci.yml`: Removed explicit `version: 10` parameter from two pnpm setup steps
  - Removed from `test` job (lines 24-26)
  - Removed from `lint-commits` job (lines 98-100)

### Key Changes

- **Removed version conflict**: Deleted the `with: version: 10` configuration from both pnpm/action-setup@v4 steps in the workflow
- **Single source of truth**: CI now automatically uses pnpm@10.17.0 from package.json's `packageManager` field
- **Fixed cascading failures**: Dependencies now install correctly, allowing all subsequent CI steps (lint, typecheck, test, build) to execute
- **Aligned environments**: CI environment now matches local development environment

### Root Cause

The CI workflow specified `version: 10` while package.json specified `packageManager: "pnpm@10.17.0"`. The pnpm/action-setup@v4 action validates that both sources must match exactly if both are present. Since `10` != `10.17.0`, the action immediately failed with:

```
Error: Multiple versions of pnpm specified:
  - version 10 in the GitHub Action config with the key "version"
  - version pnpm@10.17.0 in the package.json with the key "packageManager"
```

This prevented dependency installation and caused all subsequent CI checks to fail, even though the code itself was correct.

## How to Use

The fix is automatic and transparent to developers. When you push commits to a Pull Request:

1. The GitHub Actions CI workflow will automatically run
2. pnpm will be set up using the version from package.json (10.17.0)
3. Dependencies will install successfully
4. All CI checks (lint, typecheck, test, build) will execute properly
5. Checks will pass (✅) when code is correct, fail (❌) only when there are actual issues

## Configuration

**pnpm Version Management**:

- The single source of truth for pnpm version is now `package.json`:
  ```json
  "packageManager": "pnpm@10.17.0"
  ```
- The CI workflow automatically detects and uses this version
- No explicit version configuration in `.github/workflows/ci.yml`

## Testing

The fix was validated with:

- `pnpm lint` - Passed locally
- `pnpm typecheck` - Passed locally
- `pnpm test:unit` - All 44 tests passed
- `pnpm build` - Build succeeded
- GitHub Actions workflow execution - All CI checks passed after fix

## Notes

- This follows the pnpm/action-setup@v4 best practice of using the packageManager field as the single source of truth
- The fix is minimal and surgical - only the conflicting version specification was removed
- No changes to actual linting, type checking, testing, or build configurations were needed
- The code quality checks themselves were working correctly; only the CI setup was broken
- After this fix, CI will fail only when there are actual code quality issues, not due to setup problems
