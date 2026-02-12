# Bug: Fix GitHub CI Checks Always Failing

## Metadata

issue*number: `974f08ca`
adw_id: `7`
issue_json: `{"number":7,"title":"Arreglar GitHub CI Checks que Siempre Fallan","body":"/bug\n\n  adw_sdlc_ZTE_iso\n\n  ## Descripción del Problema\n\n  Los GitHub CI checks en los Pull Requests siempre muestran estado de **fallo** (❌) incluso cuando todo está correcto y el código funciona\n  perfectamente. Esto dificulta identificar problemas reales y genera ruido en el proceso de review.\n\n  ### Evidencia\n\n  Los checks que fallan constantemente:\n  - `Lint / Run linters (pull_request)`- ❌ Siempre rojo\n  -`Type Check / Run type checking (pull_request)`- ❌ Siempre rojo\n  -`Unit Tests / Run unit tests (pull_request)`- ❌ Siempre rojo\n  -`Build / Build production (pull_request)`- ❌ Siempre rojo\n\n  ### Comportamiento Esperado vs Actual\n\n  **Esperado:**\n  - ✅ Checks en verde cuando el código está correcto\n  - ❌ Checks en rojo solo cuando hay errores reales\n\n  **Actual:**\n  - ❌ Todos los checks siempre en rojo\n  - Imposible distinguir PRs buenos de PRs con problemas reales\n\n  ### Posibles Causas\n\n  1. **Configuración incorrecta de GitHub Actions workflows**\n     - Rutas incorrectas en los workflows\n     - Comandos que retornan código de error incorrecto\n     - Falta de permisos en los workflows\n\n  2. **Scripts de CI mal configurados**\n     -`package.json`scripts que fallan silenciosamente\n     - Configuración de ESLint/TypeScript muy estricta\n     - Tests que fallan por configuración, no por código\n\n  3. **Problemas con cache o dependencias**\n     - Cache corrupto en GitHub Actions\n     - Versiones de Node.js incompatibles\n\n  ### Archivos a Revisar\n\n  -`.github/workflows/*.yml`- Workflows de GitHub Actions\n  -`package.json`- Scripts de lint, test, build\n  -`.eslintrc.\_`- Configuración de ESLint\n  -`tsconfig.json`- Configuración de TypeScript\n  -`jest.config.\*` o similar - Configuración de tests\n\n  ### Criterios de Aceptación\n\n  - [ ] Todos los CI checks pasan (✅) cuando el código está correcto\n  - [ ] Checks fallan (❌) solo cuando hay errores reales\n  - [ ] Logs de los checks son claros y útiles para debugging\n  - [ ] Documentación actualizada de cómo funcionan los checks\n\n  ### Impacto\n\n  **Alto** - Afecta la confiabilidad del proceso de CI/CD y dificulta el code review efectivo."}`

## Bug Description

The GitHub CI checks in Pull Requests always show failure status (❌) even when the code is correct and all local checks pass successfully. This makes it impossible to distinguish between PRs with actual problems and PRs that are ready to merge.

All four CI checks consistently fail:

- Lint / Run linters (pull_request) - ❌
- Type Check / Run type checking (pull_request) - ❌
- Unit Tests / Run unit tests (pull_request) - ❌
- Build / Build production (pull_request) - ❌

Local testing confirms that all checks actually pass:

- `pnpm lint` - ✅ Passes with exit code 0
- `pnpm typecheck` - ✅ Passes with no errors
- `pnpm test:unit` - ✅ All 44 tests pass
- `pnpm build` - ✅ Build completes successfully

## Problem Statement

The GitHub Actions CI workflow is failing during the pnpm setup step due to a version conflict. The workflow specifies `version: 10` in the pnpm action configuration, while package.json specifies `"packageManager": "pnpm@10.17.0"`. This causes the pnpm action to error with:

```
Error: Multiple versions of pnpm specified:
  - version 10 in the GitHub Action config with the key "version"
  - version pnpm@10.17.0 in the package.json with the key "packageManager"
```

This prevents the workflow from installing dependencies, which causes all subsequent steps (lint, typecheck, test, build) to fail even though the code itself is correct.

## Solution Statement

Fix the pnpm version conflict in the GitHub Actions workflow by removing the explicit `version: 10` configuration from the pnpm action setup. The pnpm action will automatically detect and use the version specified in package.json's `packageManager` field (`pnpm@10.17.0`), which is the recommended best practice for ensuring version consistency across environments.

## Steps to Reproduce

1. Create any Pull Request with valid code changes
2. Push commits to the PR branch
3. Observe GitHub Actions CI workflow execution
4. Notice that the workflow fails at the "Setup pnpm" step with version mismatch error
5. All subsequent CI checks are marked as failed despite code being correct

## Root Cause Analysis

The root cause is a configuration mismatch in `.github/workflows/ci.yml`:

1. **Two pnpm version sources**: The workflow defines pnpm version in two conflicting places:
   - GitHub Actions workflow: `version: 10` in `pnpm/action-setup@v4`
   - package.json: `"packageManager": "pnpm@10.17.0"`

2. **pnpm action behavior**: The `pnpm/action-setup@v4` action validates that if both sources specify versions, they must match exactly. Since `10` != `10.17.0`, it errors immediately.

3. **Cascading failures**: Because pnpm setup fails:
   - Dependencies are never installed
   - All subsequent steps (lint, typecheck, test, build) cannot run
   - The entire CI workflow is marked as failed

4. **Local vs CI difference**: Locally, developers use the pnpm version specified in package.json (10.17.0), so everything works correctly. The CI failure only occurs in GitHub Actions.

## Relevant Files

Use these files to fix the bug:

- `.github/workflows/ci.yml` - Contains the GitHub Actions CI workflow with the pnpm version conflict. This is the primary file that needs to be fixed by removing the explicit `version: 10` parameter from the pnpm action setup (lines 24-26 and 98-100). The action will automatically use the version from package.json.

- `package.json` - Contains the correct pnpm version specification (`"packageManager": "pnpm@10.17.0"`) that should be the single source of truth. No changes needed to this file.

- `README.md` - May need to be updated if it documents CI/CD setup or troubleshooting. Should verify CI setup documentation is accurate after the fix.

## Step by Step Tasks

### Fix pnpm version conflict in CI workflow

- Read `.github/workflows/ci.yml` to understand the full workflow structure
- Remove the explicit `version: 10` parameter from both pnpm setup steps (in both the `test` and `lint-commits` jobs)
- Keep the pnpm action call but let it auto-detect the version from package.json's `packageManager` field
- This ensures the CI uses the same pnpm version as specified in package.json

### Verify the fix locally

- Validate the YAML syntax is correct
- Ensure all job steps remain intact after the modification
- Confirm the workflow structure is unchanged except for the version parameter removal

### Test the CI workflow

- Push the changes to the PR branch
- Monitor the GitHub Actions workflow execution
- Verify that the "Setup pnpm" step now passes successfully
- Confirm all subsequent CI checks (lint, typecheck, test, build) execute and pass

## Validation Commands

Execute every command to validate the bug is fixed with zero regressions.

- `pnpm lint` - Verify linting still passes locally (should succeed)
- `pnpm typecheck` - Verify type checking still passes locally (should succeed)
- `pnpm test:unit` - Verify all unit tests still pass locally (should succeed)
- `pnpm build` - Verify production build still succeeds locally (should succeed)
- `git add .github/workflows/ci.yml && git commit -m "fix: resolve pnpm version conflict in CI workflow"` - Commit the fix
- `git push origin bug-issue-7-adw-974f08ca-fix-ci-checks-failing` - Push to trigger GitHub Actions
- Use `gh run list --limit 1` and `gh run view` to monitor the CI workflow execution and verify all checks pass

## Notes

- The fix is minimal and surgical - only removing the conflicting version specification
- This follows the pnpm/action-setup@v4 best practice of using packageManager field as single source of truth
- No changes to actual linting, type checking, testing, or build configurations are needed
- The code quality checks themselves are working correctly; only the CI setup was broken
- After this fix, the CI will fail only when there are actual code quality issues, not due to setup problems
