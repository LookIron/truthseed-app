# Bible API Library Replacement

**ADW ID:** 12
**Date:** 2026-02-13
**Specification:** specs/issue-12-adw-9dc16cf2-chore-replace-bible-library.md

## Overview

Replaced the scripture.api.bible integration (which required API key authentication) with docs-bible-api, a free API service that requires no authentication. This eliminates the need for users to configure API credentials and removes the mock fallback provider that displayed "Mock verse not found" messages when credentials were missing.

## What Was Built

- **New Bible API Client**: Reimplemented `BibleApiClient` to work with docs-bible-api's simpler REST endpoint format
- **Updated Verse Parser**: Modified reference formatting to use lowercase Spanish book names in URL path format (e.g., `mateo/16/5-10`)
- **Simplified Configuration**: Removed API key requirements from environment configuration
- **Provider Factory Cleanup**: Eliminated conditional logic that fell back to mock data when API credentials were missing
- **Deleted Mock Provider**: Removed `MockBibleProvider.ts` as it's no longer needed
- **Updated Tests**: Refactored unit tests to match the new API response format and URL structure

## Technical Implementation

### Files Modified

- `src/lib/bible-api-client.ts`: Complete rewrite of HTTP client to use docs-bible-api format
  - Changed base URL from `api.scripture.api.bible/v1` to `bible-api.deno.dev/api/read`
  - Removed API key authentication headers
  - Updated URL construction to path format: `/{translation}/{book}/{chapter}/{verses}`
  - Updated response parsing to handle array of verse objects instead of HTML content
  - Removed 401 (unauthorized) error handling

- `src/lib/verse-parser.ts`: Updated reference formatting for new API
  - Changed `SPANISH_BOOK_MAP` to return lowercase Spanish names (e.g., "mateo" instead of "MAT")
  - Updated numbered books to use hyphens (e.g., "1-juan" instead of "1JN")
  - Modified `formatVerseIdForApi()` to return path format (e.g., "mateo/5/13-14" instead of "MAT.5.13-MAT.5.14")

- `src/app/api/verse/route.ts`: Simplified API route handler
  - Removed environment variable checks for `BIBLE_API_BASE_URL` and `BIBLE_API_KEY`
  - Removed fallback to `MockBibleProvider`
  - Changed default translation from "RVR60" to "nvi" (Nueva Versión Internacional)
  - Simplified error handling

- `src/lib/env.ts`: Streamlined environment configuration
  - Removed `baseUrl` and `apiKey` from `getBibleApiConfig()` return value
  - Updated `isBibleApiConfigured()` to always return `true`
  - Kept `defaultTranslation` (defaults to "nvi")

- `src/lib/bible-provider-factory.ts`: Simplified provider instantiation
  - Removed configuration validation checks
  - Always returns `BibleApiProvider` (no conditional logic)
  - Removed console warnings about missing configuration

- `src/infrastructure/bible/BibleApiProvider.ts`: Updated provider implementation
  - Removed `baseUrl` and `apiKey` from constructor
  - Updated `isConfigured()` to always return `true`

- `tests/unit/bible-api-client.test.ts`: Updated test suite for new API
  - Changed mock responses to match docs-bible-api format (array of verse objects)
  - Removed tests for API key authentication and 401 errors
  - Updated test URLs to remove authentication headers
  - Kept timeout, retry, and error handling tests

- `tests/unit/verse-parser.test.ts`: Updated test expectations
  - Changed expected book codes to lowercase Spanish names
  - Changed expected verse ID format from dot notation to path format
  - Updated numbered book tests to use hyphenated format

- `.env.sample`: Simplified environment variables
  - Removed `BIBLE_API_BASE_URL` and `BIBLE_API_KEY` variables
  - Simplified `BIBLE_DEFAULT_TRANSLATION` documentation
  - Added note that no API key is required

- `README.md`: Updated documentation
  - Removed entire "Configure Bible API" section about getting API keys
  - Added brief note about docs-bible-api being free and requiring no authentication
  - Removed troubleshooting section for API key errors

### Files Deleted

- `src/infrastructure/bible/MockBibleProvider.ts`: No longer needed since the API requires no authentication

### Key Changes

**API Format Comparison:**

| Aspect              | Old (scripture.api.bible)                 | New (docs-bible-api)                                |
| ------------------- | ----------------------------------------- | --------------------------------------------------- |
| Authentication      | API key required                          | None required                                       |
| URL Format          | `/v1/bibles/{bibleId}/passages/{verseId}` | `/api/read/{translation}/{book}/{chapter}/{verses}` |
| Verse ID            | `MAT.5.13-MAT.5.14`                       | `mateo/5/13-14`                                     |
| Response            | Single passage object with HTML           | Array of verse objects with clean text              |
| Default Translation | RVR60                                     | NVI                                                 |

**Translation Codes:**

- `nvi` - Nueva Versión Internacional (new default, more modern)
- `rv60` - Reina-Valera 1960 (traditional option)

**Book Name Format:**

- Standard books: lowercase Spanish names (e.g., "mateo", "juan", "romanos")
- Numbered books: hyphenated format (e.g., "1-juan", "2-corintios", "1-pedro")

## How to Use

The Bible API integration now works automatically without any configuration:

1. **Default Usage**: Bible verses are fetched automatically using the NVI translation
2. **Change Translation**: Set `BIBLE_DEFAULT_TRANSLATION` in `.env` to use a different translation:
   ```env
   BIBLE_DEFAULT_TRANSLATION=nvi  # or rv60 for Reina-Valera 1960
   ```
3. **No API Key Needed**: The docs-bible-api service is free and requires no authentication or sign-up

## Configuration

### Environment Variables

- `BIBLE_DEFAULT_TRANSLATION` (optional): Bible translation to use
  - Default: `nvi` (Nueva Versión Internacional)
  - Options: `nvi`, `rv60`
  - No API key or base URL configuration required

### Caching

- Bible verses are cached with a 7-day TTL for performance
- Offline caching continues to work through the service worker

## Testing

All validation commands passed:

- ✅ `pnpm typecheck` - TypeScript compilation successful
- ✅ `pnpm lint` - ESLint passed with no errors
- ✅ `pnpm test:unit` - All unit tests passing with new API format
- ✅ `pnpm build` - Production build successful
- ✅ `pnpm test:e2e` - E2E tests confirm real Bible verses display (no more "Mock verse not found" messages)

## Notes

### Benefits of This Change

1. **No API Key Required**: Eliminates user friction of signing up for API credentials
2. **Simpler Setup**: Reduces configuration complexity and onboarding time
3. **No Mock Fallback**: Can always fetch real verses, improving user experience
4. **Cleaner Response Format**: JSON array is easier to parse than HTML content
5. **Better Developer Experience**: Fewer environment variables, simpler integration
6. **Reduced Documentation**: Less setup documentation needed in README

### API Endpoint

The new API endpoint is:

```
https://bible-api.deno.dev/api/read/{translation}/{book}/{chapter}/{verses}
```

Example: `https://bible-api.deno.dev/api/read/nvi/mateo/16/5-10`

### Response Format

```json
[
  {
    "verse": "Cruzaron el lago, pero a los discípulos se les había olvidado llevar pan.",
    "number": 5,
    "study": "La levadura de los fariseos",
    "id": 23679
  },
  {
    "verse": "--Tengan cuidado --les advirtió Jesús--; eviten la levadura de los fariseos y de los saduceos.",
    "number": 6,
    "id": 23680
  }
]
```

### Future Considerations

- The docs-bible-api service is maintained as an open-source project
- Consider implementing additional translations if they become available
- Monitor API availability and response times for production reliability
