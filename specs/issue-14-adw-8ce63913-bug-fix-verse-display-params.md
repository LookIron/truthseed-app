# Bug: Fix Verse Display Parameter Validation and Version Support

## Metadata

issue_number: `8ce63913`
adw_id: `14`
issue_json: `{"number":14,"title":"No se estan mostrando algunos versos como se espera","body":"/bug\n\nadw_sdlc_ZTE_iso\n\nUsando la app, vi que la version hay un error con los parametros, arrojando Invalid params, esta relacionado a dos temas el primero es que los tipos no aceptan null y cuando hacemos \"searchParams.get('verseEnd')\" si el campo no viene arroja null, corrijamos eso, para que si no viene mandemos undefines. Por otro laso la version  RVR60 no esta dentro de las validas, cuando hice una request con esa version la api me devolvio este error:\n\n{\n\"error\": \"Invalid version\",\n\"version\": \"RVR60\",\n\"supportedVersions\": [\n\"rv1960\",\n\"rv1995\",\n\"nvi\",\n\"dhh\",\n\"pdt\",\n\"kjv\"\n]\n}\n\nPor consiguiente, actualiza la version para agregando una opcion en la UI, para que el usuario escoja la version que quiere leer, entre las versiones soportadas, y esa es la que se usara en la query. aseguremos que la api quede funcionando revolviendo los versos correctamente"}`

## Bug Description

The TruthSeed application is experiencing two critical issues when fetching and displaying Bible verses:

1. **Parameter Validation Issue**: The API route validation schema expects all query parameters as strings, but `searchParams.get('verseEnd')` returns `null` when the parameter is not present. The Zod schema validation fails because it doesn't handle `null` values properly - it expects a string or `undefined`.

2. **Translation Version Mismatch**: The `truths.json` file uses translation code "RVR60" (uppercase), but the docs-bible-api only supports "rv1960" (lowercase). When verses are requested with "RVR60" translation, the API returns an error indicating invalid version. The API supports: `rv1960`, `rv1995`, `nvi`, `dhh`, `pdt`, `kjv`.

3. **No UI Translation Selection**: Users currently have no way to select their preferred Bible translation version in the UI. The translation is hardcoded in the `truths.json` data file.

## Problem Statement

The application cannot properly fetch Bible verses because:

- The API route's parameter validation schema fails when `verseEnd` is not provided (`null` vs `undefined`)
- All truths in `truths.json` use an unsupported translation code ("RVR60" instead of "rv1960")
- Users cannot choose their preferred Bible translation through the UI

## Solution Statement

Fix the parameter validation to handle missing `verseEnd` values correctly by:

1. Converting `null` values from `searchParams.get()` to `undefined` before schema validation
2. Update the Zod schema to properly handle optional parameters
3. Map "RVR60" translation code to "rv1960" in the API route or update all references in `truths.json`
4. Add a UI component (dropdown/selector) to allow users to choose their preferred Bible translation
5. Store the selected translation in localStorage and use it when fetching verses
6. Display the current translation being used alongside verse references

## Steps to Reproduce

1. Navigate to the TruthSeed application homepage
2. Load a truth that has a verse reference without `verseEnd` parameter
3. Observe the "Invalid params" error in API response
4. Attempt to fetch any verse with "RVR60" translation
5. Observe the API returns error: `{"error": "Invalid version", "version": "RVR60", "supportedVersions": ["rv1960","rv1995","nvi","dhh","pdt","kjv"]}`

## Root Cause Analysis

### Issue 1: Parameter Validation

In `src/app/api/verse/route.ts`, line 22-29:

```typescript
const query = {
  book: searchParams.get('book'),
  chapter: searchParams.get('chapter'),
  verseStart: searchParams.get('verseStart'),
  verseEnd: searchParams.get('verseEnd'), // Returns null if not present
  translation: searchParams.get('translation') || 'nvi',
};
```

The `searchParams.get()` method returns `null` when a parameter is not present, but the Zod schema at lines 6-12 expects either a string or `undefined` (via `.optional()`):

```typescript
const VerseQuerySchema = z.object({
  verseEnd: z.string().regex(/^\d+$/).optional(), // Expects string or undefined, not null
});
```

Zod's `.optional()` makes a field accept `undefined` but not `null`. When `verseEnd` is `null`, validation fails.

### Issue 2: Translation Version Mismatch

In `src/content/truths.json`, all references use:

```json
"translation": "RVR60"
```

But docs-bible-api expects lowercase "rv1960" as shown in the API documentation (app_docs/feature-12-bible-api-replacement.md). The docs-bible-api supported versions are: `rv1960`, `rv1995`, `nvi`, `dhh`, `pdt`, `kjv`.

### Issue 3: No UI Translation Selection

The application provides no UI mechanism for users to select their preferred Bible translation. The translation is embedded in the data file and not configurable by the user.

## Relevant Files

Use these files to fix the bug:

- `src/app/api/verse/route.ts` - API route with parameter validation that needs to handle null values and translation code mapping
- `src/content/truths.json` - Contains all Bible references with "RVR60" translation that needs to be updated to "rv1960"
- `src/components/TruthCard.tsx` - Component that displays verses, needs translation selector UI
- `src/infrastructure/bible/BibleApiProvider.ts` - Provider that fetches verses, may need translation code normalization
- `src/lib/bible-api-client.ts` - HTTP client that constructs API requests with translation parameter
- `src/domain/models/Reference.ts` - Reference schema that validates translation field
- `README.md` - Documentation that needs to reflect supported translations
- `.env.sample` - Environment variables for default translation configuration

### New Files

- `.claude/commands/e2e/test_bible_verse_translation_selector.md` - E2E test to validate the translation selector UI works correctly

## Step by Step Tasks

### Fix API Route Parameter Validation

- Update `src/app/api/verse/route.ts` to convert `null` values from `searchParams.get()` to `undefined` before Zod validation
- Ensure the query object construction handles missing `verseEnd` parameter correctly
- Add translation code normalization to map "RVR60" to "rv1960" (and any other legacy codes)
- Add supported translation validation to prevent invalid translation codes from reaching the API

### Update Translation Codes in Data File

- Update `src/content/truths.json` to change all "RVR60" references to "rv1960"
- Use find-and-replace to update all 34 occurrences consistently
- Validate the JSON structure remains intact after changes

### Create Translation Selector Component

- Create `src/components/TranslationSelector.tsx` component with:
  - Dropdown to select from supported translations: rv1960, rv1995, nvi, dhh, pdt, kjv
  - Display friendly names for each translation (e.g., "RVR60 - Reina Valera 1960", "NVI - Nueva Versión Internacional")
  - Save selected translation to localStorage with key "preferredTranslation"
  - Load saved translation from localStorage on component mount
  - Default to "rv1960" if no preference is saved
  - Emit translation change events that parent components can listen to

### Integrate Translation Selector in UI

- Update `src/components/TruthCard.tsx` to:
  - Import and render the `TranslationSelector` component in the Biblical Reference section
  - Use the selected translation when fetching verses (override the reference.translation value)
  - Display the current translation being used alongside the verse reference
  - Re-fetch the verse when translation changes
  - Handle loading state during translation switch

- Update `src/app/page.tsx` to:
  - Add translation selector in the header or settings area
  - Ensure translation preference persists across page refreshes
  - Optionally show translation badge/indicator

### Update Reference Schema

- Review `src/domain/models/Reference.ts` schema to ensure translation field validation accepts all supported translation codes
- Update default translation from "RVR60" to "rv1960"
- Add JSDoc comment listing all supported translation codes

### Update Documentation

- Update `README.md` to:
  - Document all supported translations with their codes: rv1960, rv1995, nvi, dhh, pdt, kjv
  - Add section about changing translation in the UI
  - Update environment variable documentation for `BIBLE_DEFAULT_TRANSLATION`
  - Remove references to "RVR60" and replace with "rv1960"

- Update `.env.sample` to:
  - Change default translation from potential "RVR60" to "rv1960"
  - Add comments listing all supported translations

### Create E2E Test for Translation Selector

- Read `.claude/commands/e2e/test_basic_query.md` and `.claude/commands/e2e/test_bible_verse_display.md` to understand E2E test structure
- Create new E2E test file `.claude/commands/e2e/test_bible_verse_translation_selector.md` that validates:
  - Translation selector is visible and accessible
  - All supported translations appear in the dropdown
  - Selecting a translation saves to localStorage
  - Selecting a translation re-fetches the verse in the new translation
  - Translation preference persists on page reload
  - Verse text changes when translation is switched
  - Take screenshots showing translation selector and verse differences between translations

### Run Validation Commands

- Execute all validation commands to ensure the bug is fixed with zero regressions
- Verify verses load correctly with the updated translation codes
- Test translation selector functionality manually and via E2E test
- Confirm parameter validation handles missing `verseEnd` correctly

## Validation Commands

Execute every command to validate the bug is fixed with zero regressions.

- `cd app && pnpm typecheck` - Run TypeScript type checking to validate schema changes with zero errors
- `cd app && pnpm lint` - Run ESLint to validate code quality with zero errors
- `cd app && pnpm test:unit` - Run unit tests to validate translation code changes with zero regressions
- `cd app && pnpm build` - Run production build to validate the app builds successfully with zero errors
- `cd app && pnpm validate:content` - Validate truths.json schema integrity after translation code updates
- Read `.claude/commands/test_e2e.md`, then read and execute the new `.claude/commands/e2e/test_bible_verse_translation_selector.md` test file to validate translation selector functionality works correctly
- Manually test the application:
  - Navigate to homepage and verify a verse loads without "Invalid params" error
  - Verify translation selector appears in the UI
  - Select each supported translation and verify verses load correctly
  - Verify translation preference persists after page reload
  - Test verses with and without `verseEnd` parameter to ensure parameter validation works

## Notes

### Translation Code Mapping

The docs-bible-api uses lowercase translation codes. Create a mapping utility if needed:

- "RVR60" → "rv1960" (Reina-Valera 1960)
- "RVR95" → "rv1995" (Reina-Valera 1995)
- "NVI" → "nvi" (Nueva Versión Internacional)
- "DHH" → "dhh" (Dios Habla Hoy)
- "PDT" → "pdt" (Palabra de Dios para Todos)
- "KJV" → "kjv" (King James Version)

### Supported Translations from docs-bible-api

According to the API error response, the officially supported translations are:

- `rv1960` - Reina-Valera 1960 (traditional Spanish)
- `rv1995` - Reina-Valera 1995
- `nvi` - Nueva Versión Internacional (modern Spanish)
- `dhh` - Dios Habla Hoy
- `pdt` - Palabra de Dios para Todos
- `kjv` - King James Version (English)

### Parameter Handling Best Practices

When working with Next.js `searchParams.get()`:

- Always convert `null` to `undefined` for optional parameters
- Use `searchParams.get('param') ?? undefined` pattern
- Ensure Zod schemas use `.optional()` or `.nullable()` correctly
- For parameters that should have defaults, use `searchParams.get('param') || 'default'`

### localStorage Considerations

- Use a consistent key for translation preference: "preferredTranslation" or "bibleTranslation"
- Always provide a fallback default when reading from localStorage
- Handle cases where localStorage might not be available (SSR)
- Consider adding clear/reset functionality for user preferences

### UI/UX Considerations

- Place translation selector prominently but not intrusively (e.g., near the verse reference)
- Use clear, recognizable translation names (full names + codes)
- Show loading indicator when switching translations
- Consider showing a tooltip explaining translation differences
- Ensure selector is accessible (keyboard navigation, screen readers)
- Maintain selection state during "Otra verdad" navigation
