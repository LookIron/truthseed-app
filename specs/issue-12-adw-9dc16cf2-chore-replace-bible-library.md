# Chore: Replace Bible Library with docs-bible-api

## Metadata

issue_number: `9dc16cf2`
adw_id: `12`
issue_json: `{"number":12,"title":"Replace the Bible librery for a librery without Api key","body":"/chore\n\nadw_sdlc_ZTE_iso\n\nReplace the current librery to get the bible verse, for docs-bible-api, that one doesn't requere an api key and is easy to use, in the documentation link, is defined how to use it.\n\nWhen we test, we should see the text and not the \"Mock verse not found: ...\"\n\n\nExample: GET: https://bible-api.deno.dev/api/read/nvi/mateo/16/5-10\nResponse:\n`[\n{\n\"verse\": \"Cruzaron el lago, pero a los discípulos se les había olvidado llevar pan.\",\n\"number\": 5,\n\"study\": \"La levadura de los fariseos\",\n\"id\": 23679\n},\n{\n\"verse\": \"--Tengan cuidado --les advirtió Jesús--; eviten la levadura de los fariseos y de los saduceos.\",\n\"number\": 6,\n\"id\": 23680\n},\n{\n\"verse\": \"Ellos comentaban entre sí: \\\"Lo dice porque no trajimos pan.\\\"\",\n\"number\": 7,\n\"id\": 23681\n},\n{\n\"verse\": \"Al darse cuenta de esto, Jesús les recriminó: --Hombres de poca fe, ¿por qué están hablando de que no tienen pan?\",\n\"number\": 8,\n\"id\": 23682\n},\n{\n\"verse\": \"¿Todavía no entienden? ¿No recuerdan los cinco panes para los cinco mil, y el número de canastas que recogieron?\",\n\"number\": 9,\n\"id\": 23683\n},\n{\n\"verse\": \"¿Ni los siete panes para los cuatro mil, y el número de cestas que recogieron?\",\n\"number\": 10,\n\"id\": 23684\n}\n]`\n\nReferences:\nBooks: https://docs-bible-api.netlify.app/api/books\nSearch: https://docs-bible-api.netlify.app/api/search\nVersions: https://docs-bible-api.netlify.app/api/versions\nVerses: https://docs-bible-api.netlify.app/api/verses\nChapter: https://docs-bible-api.netlify.app/api/chapter\nExamples: https://docs-bible-api.netlify.app/api/examples\n\n"}`

## Chore Description

Replace the current Bible API integration (scripture.api.bible) which requires an API key with docs-bible-api, a free API that doesn't require authentication. The current implementation shows "Mock verse not found: ..." messages when the API key is not configured. The new implementation should fetch real Bible verses without requiring any API key configuration, making it easier to use and eliminating the need for users to configure API credentials.

The docs-bible-api service provides a simple REST API at `https://bible-api.deno.dev/api/read/{translation}/{book}/{chapter}/{verse}` that returns verse data in JSON format. The API supports multiple Spanish translations including NVI (Nueva Versión Internacional) and RVR60 (Reina-Valera 1960).

This chore involves:

1. Replacing the BibleApiClient implementation to use docs-bible-api instead of scripture.api.bible
2. Updating the verse-parser to format references for the new API format (e.g., "mateo/16/5-10" instead of "MAT.16.5-16.10")
3. Removing API key requirements from environment configuration
4. Updating the API route handler to work with the new API response format
5. Updating unit tests to reflect the new API integration
6. Removing the MockBibleProvider fallback (no longer needed since the API doesn't require authentication)
7. Updating documentation to reflect the simplified configuration

## Relevant Files

### Existing Files to Modify

- **src/lib/bible-api-client.ts** (241 lines) - Core HTTP client that fetches verses from scripture.api.bible. This needs to be completely rewritten to use docs-bible-api instead. The new implementation should:
  - Change the base URL to `https://bible-api.deno.dev/api/read`
  - Remove API key authentication headers (no longer needed)
  - Update the URL format to match docs-bible-api: `/{translation}/{book}/{chapter}/{verseStart}-{verseEnd}`
  - Handle the new response format which returns an array of verse objects with `verse`, `number`, `study`, and `id` fields
  - Combine multiple verses into a single text string
  - Keep timeout and retry logic for reliability

- **src/lib/verse-parser.ts** (193 lines) - Parses Spanish book names and converts them to API-compatible IDs. Currently converts to scripture.api.bible format (e.g., "MAT.5.13"). This needs to be updated to:
  - Return lowercase Spanish book names instead of API codes (e.g., "mateo" instead of "MAT")
  - Format verse IDs as path segments: `mateo/5/13-14` instead of `MAT.5.13-MAT.5.14`
  - Update the `SPANISH_BOOK_MAP` to map to lowercase Spanish book names that match docs-bible-api expectations
  - Ensure numbered books work correctly (e.g., "1 Juan" → "1-juan")

- **src/app/api/verse/route.ts** (132 lines) - API route that proxies Bible API requests. Currently checks for BIBLE_API_BASE_URL and BIBLE_API_KEY environment variables. This needs to be updated to:
  - Remove environment variable checks (no API key needed)
  - Remove fallback to MockBibleProvider (no longer needed)
  - Update to handle the new docs-bible-api response format (array of verse objects)
  - Keep caching headers (7-day cache is still beneficial)

- **src/lib/env.ts** (58 lines) - Environment configuration helper. Currently exports `getBibleApiConfig()` which expects BIBLE_API_BASE_URL, BIBLE_API_KEY, and BIBLE_DEFAULT_TRANSLATION. This should be updated to:
  - Simplify `getBibleApiConfig()` to only return `defaultTranslation` (defaults to "nvi")
  - Remove `baseUrl` and `apiKey` from the config object
  - Update `isBibleApiConfigured()` to always return true (no configuration needed)

- **src/lib/bible-provider-factory.ts** (75 lines) - Factory that creates BibleProvider instances (BibleApiProvider or MockBibleProvider based on configuration). This should be simplified to:
  - Always return BibleApiProvider (no configuration check needed)
  - Remove the MockBibleProvider fallback
  - Simplify the `createBibleProvider()` function

- **src/infrastructure/bible/BibleApiProvider.ts** (96 lines) - Provider implementation that calls the /api/verse route. This needs minor updates to:
  - Update `isConfigured()` to always return true
  - Remove the baseUrl and apiKey parameters from the constructor (keep defaultTranslation)
  - The fetch call to `/api/verse` should continue to work as-is since the route handler will be updated

- **tests/unit/bible-api-client.test.ts** (719 lines) - Comprehensive unit tests for BibleApiClient. This needs to be updated to:
  - Remove tests for API key authentication (401 errors)
  - Update mock responses to match docs-bible-api format (array of verse objects)
  - Update test URLs to match new format (no authentication headers)
  - Keep tests for timeout, retry logic, and error handling

- **tests/unit/verse-parser.test.ts** (430 lines) - Unit tests for verse parsing logic. This needs to be updated to:
  - Update expected outputs to lowercase Spanish book names instead of API codes
  - Update expected verse ID format from "MAT.5.13" to "mateo/5/13"
  - Ensure numbered books tests work correctly with new format

- **.env.sample** (88 lines) - Sample environment configuration. This needs to be updated to:
  - Remove BIBLE_API_BASE_URL and BIBLE_API_KEY variables and their documentation
  - Simplify BIBLE_DEFAULT_TRANSLATION documentation to mention "nvi" and "rv60" as options
  - Add note that no API key is required for Bible verse fetching

- **README.md** (601 lines) - Project documentation. This needs to be updated to:
  - Remove the entire "Configure Bible API" section (lines 71-142) about getting API keys from scripture.api.bible
  - Add a brief note that Bible verses are fetched from docs-bible-api (a free, no-authentication-required service)
  - Remove references to API key configuration in environment variables section
  - Remove troubleshooting section for API key errors and rate limiting

### Files to Delete

- **src/infrastructure/bible/MockBibleProvider.ts** (89 lines) - Mock provider that returns hardcoded verse text. This is no longer needed since docs-bible-api doesn't require authentication and can be used directly without fallback.

### New Files

None required. All changes are modifications to existing files.

## Step by Step Tasks

IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Update verse-parser for docs-bible-api format

- Read `src/lib/verse-parser.ts` to understand the current implementation
- Update `SPANISH_BOOK_MAP` to return lowercase Spanish book names matching docs-bible-api format instead of API codes:
  - Example: "mateo" instead of "MAT", "juan" instead of "JHN", "romanos" instead of "ROM"
  - For numbered books: "1-juan" instead of "1JN", "2-corintios" instead of "2CO"
- Update `formatVerseIdForApi()` to return path format instead of dot notation:
  - Single verse: "mateo/5/13" instead of "MAT.5.13"
  - Verse range: "mateo/5/13-14" instead of "MAT.5.13-MAT.5.14"
- Update JSDoc comments to reflect the new format

### Step 2: Update BibleApiClient for docs-bible-api

- Read `src/lib/bible-api-client.ts` to understand the current implementation
- Update the base URL to `https://bible-api.deno.dev/api/read`
- Remove API key parameter from constructor (keep baseUrl for potential overrides and translation)
- Remove `api-key` header from fetch requests
- Update URL construction to use path format: `${baseUrl}/${translation}/${verseId}`
  - Note: verseId is already formatted by verse-parser as "mateo/5/13-14"
- Update response parsing to handle docs-bible-api format (array of verse objects):
  - Extract `verse` field from each object in the array
  - Combine multiple verses with space separator
  - Handle empty arrays gracefully
- Update error handling:
  - Remove 401 (unauthorized) handling since no authentication is used
  - Keep 404 (not found), 429 (rate limit), and 5xx (server error) handling
- Update JSDoc comments to reflect the new API

### Step 3: Update environment configuration

- Read `src/lib/env.ts` to understand current implementation
- Update `getBibleApiConfig()` to remove `baseUrl` and `apiKey`:
  - Return only `{ defaultTranslation: process.env.BIBLE_DEFAULT_TRANSLATION || 'nvi' }`
- Update `isBibleApiConfigured()` to always return `true`
- Update JSDoc comments to reflect simplified configuration

### Step 4: Simplify bible-provider-factory

- Read `src/lib/bible-provider-factory.ts` to understand current implementation
- Update `createBibleProvider()` to always return `BibleApiProvider`:
  - Remove configuration validation checks
  - Remove fallback to MockBibleProvider
  - Remove console.warn about missing configuration
- Update BibleApiProvider instantiation to not pass baseUrl and apiKey
- Update JSDoc comments to reflect simplified logic

### Step 5: Update BibleApiProvider

- Read `src/infrastructure/bible/BibleApiProvider.ts` to understand current implementation
- Update constructor to remove baseUrl and apiKey parameters (keep defaultTranslation)
- Update `isConfigured()` to always return `true`
- Remove configuration check from `fetchVerse()` method
- Update JSDoc comments to reflect the changes

### Step 6: Update API route for new response format

- Read `src/app/api/verse/route.ts` to understand current implementation
- Remove environment variable checks for BIBLE_API_BASE_URL and BIBLE_API_KEY (lines 44-56)
- Remove fallback to MockBibleProvider (lines 90-106)
- Update BibleApiClient instantiation to not pass baseUrl and apiKey
- Keep the existing caching headers (7-day cache is still beneficial)
- Update error responses to remove references to missing API configuration
- Update JSDoc comments

### Step 7: Delete MockBibleProvider

- Delete the file `src/infrastructure/bible/MockBibleProvider.ts`
- Verify no other files import MockBibleProvider besides the files already being updated

### Step 8: Update unit tests for bible-api-client

- Read `tests/unit/bible-api-client.test.ts` to understand current tests
- Update mock responses to match docs-bible-api format (array of verse objects with `verse`, `number`, `id` fields)
- Remove tests for API key authentication and 401 errors
- Update test URLs to remove authentication headers
- Update constructor instantiation in tests to not pass apiKey
- Keep tests for timeout, retry logic, error handling, and HTML cleaning

### Step 9: Update unit tests for verse-parser

- Read `tests/unit/verse-parser.test.ts` to understand current tests
- Update all expected outputs to match new format:
  - Book codes: "mateo" instead of "MAT", "juan" instead of "JHN"
  - Numbered books: "1-juan" instead of "1JN", "2-corintios" instead of "2CO"
  - Verse IDs: "mateo/5/13" instead of "MAT.5.13"
  - Verse ranges: "mateo/5/13-14" instead of "MAT.5.13-MAT.5.14"

### Step 10: Update environment sample file

- Read `.env.sample` to understand current configuration
- Remove BIBLE_API_BASE_URL variable and its documentation (lines 15)
- Remove BIBLE_API_KEY variable and its documentation (lines 17-18)
- Simplify BIBLE_DEFAULT_TRANSLATION documentation:
  - Mention "nvi" (Nueva Versión Internacional) as the default
  - Mention "rv60" (Reina-Valera 1960) as an alternative
  - Add note that this API doesn't require authentication
- Remove caching notes related to API rate limits (lines 26-29)
- Update fallback behavior notes (lines 31-34) to indicate no API key is needed

### Step 11: Update README documentation

- Read `README.md` to understand current documentation structure
- Remove the "Configure Bible API" section (lines 71-142) entirely
- Add a brief section after "Copy environment variables" (around line 69):

  ````markdown
  4. (Optional) Configure Bible Translation:

  The TruthSeed app fetches real Bible verses from docs-bible-api, a free service that doesn't require an API key. By default, it uses the NVI (Nueva Versión Internacional) translation.

  To use a different translation, edit your `.env` file:

  ```env
  BIBLE_DEFAULT_TRANSLATION=nvi  # or rv60 for Reina-Valera 1960
  ```
  ````

  The app automatically fetches and caches verses for offline access.

  ```

  ```

- Update the environment variables table (around line 362) to remove BIBLE_API_BASE_URL and BIBLE_API_KEY rows
- Update BIBLE_DEFAULT_TRANSLATION row to indicate "nvi" as the default
- Remove the "Troubleshooting" section for Bible API errors (around lines 115-147)
- Update the "Acknowledgments" section (line 519) to reference docs-bible-api instead of scripture.api.bible

### Step 12: Run validation commands

Execute validation commands to ensure zero regressions.

## Validation Commands

Execute every command to validate the chore is complete with zero regressions.

- `pnpm typecheck` - Verify TypeScript compilation succeeds with no type errors
- `pnpm lint` - Verify ESLint passes with no linting errors
- `pnpm test:unit` - Run all unit tests to verify the new API integration works correctly
- `pnpm build` - Build the application for production to verify no build errors
- `pnpm test:e2e` - Run E2E tests to verify Bible verses display correctly (should see real verse text, not "Mock verse not found")

## Notes

### API Format Comparison

**Current (scripture.api.bible):**

- Requires API key authentication
- URL format: `https://api.scripture.api.bible/v1/bibles/{bibleId}/passages/{verseId}`
- Verse ID format: `MAT.5.13-MAT.5.14`
- Response: Single passage object with HTML content that needs cleaning

**New (docs-bible-api):**

- No authentication required
- URL format: `https://bible-api.deno.dev/api/read/{translation}/{book}/{chapter}/{verses}`
- Verse path format: `nvi/mateo/5/13-14`
- Response: Array of verse objects with clean text

### Translation Codes

docs-bible-api uses different translation codes:

- `nvi` - Nueva Versión Internacional (default, most modern)
- `rv60` - Reina-Valera 1960 (traditional)

### Book Name Format

docs-bible-api expects lowercase Spanish book names in URLs:

- Standard books: "mateo", "juan", "romanos"
- Numbered books: "1-juan", "2-corintios", "1-pedro"
- Accented names: Works with or without accents but prefer lowercase

### Benefits of this Change

1. **No API Key Required**: Eliminates the need for users to sign up and configure API credentials
2. **Simpler Setup**: Reduces configuration complexity and documentation burden
3. **No Mock Fallback Needed**: Can always fetch real verses without authentication
4. **Cleaner Response Format**: JSON array is easier to parse than HTML content
5. **Better Developer Experience**: Fewer environment variables and simpler integration

### Testing Strategy

After implementation:

1. Verify unit tests pass with updated mock responses
2. Run the app locally and click through multiple truths
3. Verify real Bible verses display (not "Mock verse not found")
4. Verify verses are in Spanish and match the references
5. Test both single verses and verse ranges
6. Test different books (Mateo, Juan, Romanos, 1 Juan, etc.)
7. Verify offline caching still works
