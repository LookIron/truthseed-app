# Test TruthSeed PWA

Run the complete test suite for TruthSeed PWA.

## Instructions

Execute all tests in the following order:

### 1. Content Validation

```bash
pnpm validate:content
```

Validates `truths.json` against Zod schemas.

Expected output:

```
🔍 Validating truths.json...
✅ Validation successful!
📊 Statistics:
   Total truths: 10
   Categories: 6
   Total references: 10
✨ All truths are valid and ready to use!
```

### 2. Type Check

```bash
pnpm typecheck
```

Runs TypeScript compiler in no-emit mode.

Expected output:

```
> tsc --noEmit
(no output = success)
```

### 3. Lint

```bash
pnpm lint
```

Runs ESLint on all TypeScript/JavaScript files.

Expected output:

```
> next lint
✓ No ESLint warnings or errors
```

### 4. Unit Tests

```bash
pnpm test:unit
```

Runs Vitest unit tests.

Expected output:

```
 ✓ tests/unit/randomSelector.test.ts (9 tests)
 ✓ tests/unit/WebSpeechService.test.ts (12 tests)
 ✓ tests/unit/schemas.test.ts (13 tests)

 Test Files  3 passed (3)
      Tests  34 passed (34)
```

### 5. Build Test

```bash
pnpm build
```

Ensures production build succeeds.

Expected output:

```
   ▲ Next.js 15.5.12
 ✓ Compiled successfully
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ✓ Generating static pages (5/5)
 ✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    20.3 kB        122 kB
└ ƒ /api/verse                           121 B          102 kB
```

## Test Summary

Report the results:

```
✅ Content Validation: PASSED
✅ Type Check: PASSED
✅ Lint: PASSED
✅ Unit Tests: 34/34 PASSED
✅ Build: PASSED
```

## Running Specific Tests

### Unit Tests (watch mode)

```bash
pnpm test:unit:watch
```

### Coverage Report

```bash
pnpm test:coverage
```

Generates coverage report in `coverage/` directory.
Thresholds: 80% (lines, functions, branches, statements)

### E2E Tests

```bash
pnpm test:e2e
```

Runs Playwright E2E tests (requires built app).

## Test Files

- **Unit Tests**: `tests/unit/`
  - `schemas.test.ts` - Zod schema validation
  - `randomSelector.test.ts` - Random selection logic
  - `WebSpeechService.test.ts` - TTS service

- **E2E Tests**: `tests/e2e/`
  - `home.spec.ts` - Home page interactions

- **Content**: `src/content/truths.json`

## Troubleshooting

If tests fail:

### Content Validation Fails

```bash
# Check truths.json format
cat src/content/truths.json | jq .

# Validate manually
pnpm validate:content
```

### Type Check Fails

```bash
# See detailed errors
pnpm typecheck

# Check specific file
npx tsc --noEmit src/path/to/file.ts
```

### Unit Tests Fail

```bash
# Run with verbose output
pnpm test:unit --reporter=verbose

# Run specific test file
pnpm vitest tests/unit/schemas.test.ts
```

### Build Fails

```bash
# Clean and rebuild
pnpm clean
pnpm install
pnpm build
```

## CI/CD

Tests run automatically in CI (GitHub Actions):

- On pull requests to main
- Includes all checks above
- E2E tests run on Node 20.x only

## Notes

- Tests must pass before merging PRs
- Coverage threshold is 80%
- E2E tests require app build first
- Mock providers used for external APIs
- Tests run in isolation (no side effects)
