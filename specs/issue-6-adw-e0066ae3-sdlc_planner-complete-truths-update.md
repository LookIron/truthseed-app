# Bug: Complete Truths JSON Update

## Metadata

issue_number: `6`
adw_id: `e0066ae3`
issue_json: `{"number":6,"title":"Completar Actualización de Truths","body":"/bug\n\n adw_sdlc_iso\n\n  ## Descripción del Problema\n\nEl PR #4 del issue #3 se mergeó pero **los cambios principales no se aplicaron correctamente**. El archivo `src/content/truths.json`en main\n  todavía contiene los datos antiguos/hardcoded en lugar de la lista completa de verdades bíblicas especificadas en las imágenes del issue #3.\n\n  ### Estado Actual\n  -`src/content/truths.json`en main: **168 líneas** (datos incompletos)\n  - Datos correctos en el worktree: **546 líneas** (lista completa)\n\n  ### Cambios Requeridos\n\n  El archivo`src/content/truths.json`debe actualizarse con la lista completa de verdades bíblicas que incluye:\n  - Todas las verdades con sus títulos correctos\n  - Referencias bíblicas completas para cada verdad\n  - Tags apropiados para cada verdad\n\n  Las verdades correctas están documentadas en:\n  - Imagen 1: Primera mitad de la lista\n  - Imagen 2: Segunda mitad de la lista\n\n  ### Archivos Afectados\n  -`src/content/truths.json`(principal)\n\n  ### Criterios de Aceptación\n  - [ ]`src/content/truths.json`contiene todas las verdades de las imágenes\n  - [ ] Cada verdad tiene su título, referencia bíblica y tags correctos\n  - [ ] El archivo tiene aproximadamente 540+ líneas (lista completa)\n  - [ ] Tests unitarios pasan\n  - [ ] Build de producción exitoso\n\n  ### Referencias\n  - Issue original: #3\n  - PR parcial: #4 (solo incluyó configs, faltó el JSON principal)\n  - Worktree con cambios correctos:`trees/ba7a352e`"}`

## Bug Description

PR #4 from issue #3 was merged into main but the main content changes were not applied correctly. The file `src/content/truths.json` in the main branch still contains the old/hardcoded data (168 lines) instead of the complete list of biblical truths (546 lines) that was specified in issue #3's images.

The correct data exists in the worktree `trees/ba7a352e` with 546 lines containing the full list of biblical truths with proper titles, references, and tags. The current main branch data is incomplete with only 10 truth entries.

## Problem Statement

The `src/content/truths.json` file needs to be updated with the complete list of biblical truths from the worktree `trees/ba7a352e` which contains all the truths documented in issue #3's images. The current file has incomplete data that must be replaced with the full list.

## Solution Statement

Copy the complete `truths.json` file from the worktree `trees/ba7a352e/src/content/truths.json` to the current worktree's `src/content/truths.json`, replacing the incomplete data with the full list of 40+ biblical truths. Validate the updated file has the correct schema, run all tests, and build successfully.

## Steps to Reproduce

1. Check current `src/content/truths.json` file: `wc -l src/content/truths.json` - shows 168 lines
2. Check worktree file: `wc -l /Users/esteban.camacho/Projects/agentic-coding/code/truthseed-app/trees/ba7a352e/src/content/truths.json` - shows 546 lines
3. Open current `src/content/truths.json` and observe only 10 truth entries
4. Open worktree `truths.json` and observe 40+ truth entries with complete data

## Root Cause Analysis

During the merge of PR #4, the main content file `src/content/truths.json` was not included in the changeset. Only configuration files were updated (service worker cache manifest, playwright config paths) but the primary data file containing the biblical truths was not updated. This appears to be a merge oversight where the file was not staged or committed in the original PR.

## Relevant Files

Use these files to fix the bug:

- `src/content/truths.json` - Current file with incomplete data (168 lines, 10 entries) that needs to be replaced with complete data from worktree
- `/Users/esteban.camacho/Projects/agentic-coding/code/truthseed-app/trees/ba7a352e/src/content/truths.json` - Source file with complete data (546 lines, 40+ entries) that contains all the biblical truths specified in issue #3
- `src/domain/models/Truth.ts` - Truth schema to validate the data structure is correct
- `scripts/validate-content.ts` - Validation script to ensure the updated JSON is valid

### New Files

No new files needed for this bug fix.

## Step by Step Tasks

IMPORTANT: Execute every step in order, top to bottom.

### 1. Verify Current State and Source Data

- Read the current `src/content/truths.json` file to understand the incomplete data
- Read the complete source file from `/Users/esteban.camacho/Projects/agentic-coding/code/truthseed-app/trees/ba7a352e/src/content/truths.json`
- Count the number of truth entries in both files to confirm the discrepancy
- Verify the source file has the correct schema by reading `src/domain/models/Truth.ts`

### 2. Copy Complete Truths Data

- Use the Bash tool to copy the complete `truths.json` from the worktree to the current location
- Run: `cp /Users/esteban.camacho/Projects/agentic-coding/code/truthseed-app/trees/ba7a352e/src/content/truths.json src/content/truths.json`
- Verify the file was copied correctly by checking line count: `wc -l src/content/truths.json` (should be 546 lines)
- Read the updated file to confirm all truth entries are present

### 3. Validate Content Schema

- Run the content validation script to ensure the JSON is valid and matches the Truth schema
- Execute: `cd /Users/esteban.camacho/Projects/agentic-coding/code/truthseed-app/trees/e0066ae3 && pnpm validate:content`
- If validation fails, review the error messages and fix any schema issues

### 4. Run All Tests and Build

- Run validation commands to ensure zero regressions (see Validation Commands section)
- All tests must pass before proceeding

## Validation Commands

Execute every command to validate the bug is fixed with zero regressions.

- `wc -l src/content/truths.json` - Verify file has approximately 546 lines (full list)
- `pnpm validate:content` - Validate the truths.json schema and structure
- `pnpm typecheck` - Run TypeScript type checking to ensure no type errors
- `pnpm lint` - Run ESLint to ensure no linting errors
- `pnpm test:unit` - Run unit tests to validate no regressions
- `pnpm build` - Build the application to ensure production build succeeds

## Notes

- The complete data already exists in worktree `trees/ba7a352e` and has been validated in previous work
- No code changes are required - this is purely a data file replacement
- The source file contains 40+ biblical truths with proper Spanish titles, renounce statements, categories, biblical references, and tags
- After this fix, the application will display the full list of biblical truths as originally intended in issue #3
- The bug occurred because PR #4 only included configuration file changes but missed the primary data file
