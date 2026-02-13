# Feature: Integrate Bible API for Real Verse Display

## Metadata

issue_number: `c5c51e28`
adw_id: `10`
issue_json: `{"number":10,"title":"Integrar API de la Biblia para mostrar versículos reales","body":"/feature\n\nadw_sdlc_ZTE_iso\n\n## Descripción del Problema\n\nActualmente, cuando se intenta mostrar las referencias bíblicas en la aplicación, aparece un mensaje mock en lugar del texto real del versículo:\n\n```\nMock verse not found: Mateo 5:13-14\n```\n\nEsto se debe a que no tenemos los textos bíblicos almacenados en la aplicación y estamos usando datos de prueba.\n\n## Solución Propuesta\n\nIntegrar una API de la Biblia para obtener los textos reales de los versículos bíblicos. Esto permitirá:\n\n1. Mostrar el texto completo del versículo en español\n2. Eliminar los mensajes \"mock\" que actualmente se muestran\n3. Proporcionar una experiencia más completa y profesional al usuario\n\n## APIs Recomendadas\n\nOpciones de APIs gratuitas de la Biblia:\n\n1. **API.Bible** (https://scripture.api.bible/)\n   - Soporta múltiples traducciones en español (RVR1960, NVI, etc.)\n   - API RESTful moderna\n   - Requiere registro gratuito para obtener API key\n\n2. **Bible API** (https://bible-api.com/)\n   - API pública sin autenticación\n   - Más simple pero con menos opciones de traducción\n\n3. **Bible Gateway API** (alternativa)\n   - Múltiples traducciones\n   - Bien documentada\n\n## Implementación Sugerida\n\n### 1. Backend API Route\nCrear endpoint en `/api/verse/[reference]`o modificar el existente para:\n- Recibir la referencia bíblica (ej: \"Mateo 5:13-14\")\n- Hacer llamada a la API de la Biblia\n- Cachear resultados para reducir llamadas externas\n- Retornar el texto del versículo\n\n### 2. Parseo de Referencias\nImplementar función para convertir referencias en formato español al formato requerido por la API:\n- \"Mateo 5:13-14\" → \"MAT.5.13-MAT.5.14\" (según formato de API)\n- Manejar libros con números (1 Juan, 2 Corintios, etc.)\n- Manejar rangos de versículos\n\n### 3. Caché\nImplementar sistema de caché para:\n- Reducir llamadas a API externa\n- Mejorar rendimiento\n- Funcionar offline con versículos previamente consultados\n\n### 4. Fallback\nMantener fallback para cuando:\n- API no esté disponible\n- Rate limit alcanzado\n- Referencia no encontrada\n\n## Criterios de Aceptación\n\n- [ ] Se integra API de la Biblia (preferiblemente API.Bible o similar)\n- [ ] El endpoint`/api/verse`retorna textos reales de versículos\n- [ ] Se parsean correctamente referencias en español (ej: \"Mateo 5:13-14\")\n- [ ] Se implementa sistema de caché para versículos consultados\n- [ ] Se manejan errores gracefully con mensajes apropiados\n- [ ] Se soportan las principales traducciones en español (RVR1960 mínimo)\n- [ ] Tests unitarios para parseo de referencias\n- [ ] Tests de integración para llamadas a API\n- [ ] Documentación de configuración de API key\n\n## Archivos Afectados\n\n-`src/app/api/verse/route.ts`(modificar o crear)\n-`src/lib/bible-api.ts`(nuevo: cliente de API)\n-`src/lib/verse-parser.ts`(nuevo: parseo de referencias)\n-`.env.example`(agregar BIBLE_API_KEY)\n-`src/app/page.tsx` (actualizar para usar API real)\n\n## Notas Técnicas\n\n- Considerar rate limits de la API seleccionada\n- Implementar retry logic para llamadas fallidas\n- Usar caché en memoria + Redis/localStorage según ambiente\n- Considerar traducción: usuario puede preferir RVR1960, NVI, etc.\n\n## Referencias\n\n- API.Bible Docs: https://scripture.api.bible/livedocs\n- Bible API Docs: https://bible-api.com/"}`

## Feature Description

The TruthSeed PWA currently displays mock messages like "Mock verse not found: Mateo 5:13-14" when attempting to show biblical references. This feature will integrate a real Bible API to fetch and display actual verse texts in Spanish, providing users with complete biblical references for each truth displayed in the application. The integration will include intelligent caching to minimize external API calls, proper error handling with graceful fallbacks, and support for multiple Spanish Bible translations (primarily RVR60).

## User Story

As a TruthSeed user
I want to see the actual text of Bible verses referenced in each truth
So that I can read the complete scriptural foundation for each biblical truth about my identity in Christ

## Problem Statement

The application currently relies on a MockBibleProvider that returns limited hardcoded verses or "Mock verse not found" error messages. This creates an incomplete user experience as many biblical references in truths.json do not have corresponding verse text. Users cannot read the full biblical context for truths without manually looking them up in a physical Bible or external app, significantly limiting the app's value and usability.

## Solution Statement

Integrate scripture.api.bible (API.Bible) to fetch real verse texts from the RVR60 (Reina-Valera 1960) Spanish translation. The solution includes: (1) a verse reference parser to convert Spanish book names to API-compatible format, (2) enhanced API route handler with intelligent caching and error handling, (3) automatic fallback to MockBibleProvider when API is unavailable, and (4) proper configuration documentation. This will provide users with complete, accurate biblical texts while maintaining offline functionality through aggressive caching.

## Relevant Files

Use these files to implement the feature:

- **src/app/api/verse/route.ts** - Currently returns mock data; needs implementation to call real Bible API with proper error handling, caching headers, and fallback logic
- **src/infrastructure/bible/BibleApiProvider.ts** - Client-side provider that calls /api/verse endpoint; may need minor updates for error handling
- **src/infrastructure/bible/MockBibleProvider.ts** - Fallback provider with hardcoded verses; will remain as backup when API unavailable
- **src/domain/services/BibleProvider.ts** - Interface definition; already well-designed, no changes needed
- **src/domain/models/Reference.ts** - Reference model with Spanish book names; already includes proper typing and cache key helpers
- **src/infrastructure/cache/IndexedDBCache.ts** - Client-side verse caching with 7-day expiration; already implemented and working
- **src/components/TruthCard.tsx** - Uses MockBibleProvider directly; should use factory pattern to select between API and Mock providers
- **src/content/truths.json** - Contains all biblical references that need verse text fetching
- **.env.sample** - Already includes Bible API configuration; needs documentation updates
- **README.md** - Contains setup instructions; needs Bible API configuration section enhancement
- **.claude/commands/test_e2e.md** - E2E test runner template for understanding test structure
- **.claude/commands/e2e/test_basic_query.md** - Example E2E test structure for reference
- **.claude/commands/e2e/test_truths_list_view.md** - Existing E2E test showing how to validate TruthSeed UI

### New Files

- **src/lib/bible-api-client.ts** - HTTP client for scripture.api.bible with authentication, request/response mapping, retry logic, and proper TypeScript types
- **src/lib/verse-parser.ts** - Utility to parse Spanish biblical references and convert book names to API-compatible IDs (e.g., "Mateo" → "MAT", "1 Juan" → "1JN")
- **src/lib/bible-provider-factory.ts** - Factory to select between BibleApiProvider and MockBibleProvider based on configuration
- **tests/unit/verse-parser.test.ts** - Unit tests for verse reference parsing logic covering all book name variations and edge cases
- **tests/unit/bible-api-client.test.ts** - Unit tests for API client including mock responses, error handling, and retry logic
- **.claude/commands/e2e/test_bible_verse_display.md** - E2E test to validate real verse fetching and display in the UI

## Implementation Plan

### Phase 1: Foundation

Create the core infrastructure for Bible API integration:

1. Research scripture.api.bible API structure and authentication requirements
2. Design verse parser mapping for all Spanish book names to API book IDs
3. Implement HTTP client with proper authentication headers and error handling
4. Create provider factory pattern to intelligently select between API and Mock providers
5. Write comprehensive unit tests for parser and client before integration

### Phase 2: Core Implementation

Integrate the Bible API into the existing application flow:

1. Update /api/verse route to use the new bible-api-client for fetching real verses
2. Implement proper error handling with fallback to MockBibleProvider when API fails
3. Add server-side caching with appropriate cache headers (7-day duration)
4. Update TruthCard component to use provider factory instead of hardcoded MockBibleProvider
5. Add proper loading states and error messages in the UI
6. Ensure IndexedDBCache properly stores and retrieves verses from both providers

### Phase 3: Integration

Complete the feature with testing, documentation, and validation:

1. Create E2E test to verify end-to-end verse fetching and display
2. Test with and without API key to ensure fallback works correctly
3. Update documentation with API key setup instructions
4. Validate all existing truths.json references work with new API
5. Run full test suite to ensure zero regressions
6. Verify offline functionality with cached verses

## Step by Step Tasks

IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Research and Design

- Read scripture.api.bible documentation to understand API structure, authentication, rate limits, and response format
- Identify the Bible ID for RVR60 translation (likely "592420522e16049f-01")
- Document all 66 Bible book names in Spanish and their API-compatible 3-letter codes (e.g., "Génesis" → "GEN", "Mateo" → "MAT")
- Create mapping structure for books with numbers (1 Juan, 2 Corintios, etc.)
- Design error handling strategy: API errors → fallback to Mock → display user-friendly message

### Step 2: Implement Verse Parser

- Create `src/lib/verse-parser.ts` with function `parseSpanishBookName(bookName: string): string | null`
- Implement comprehensive book name mapping for all 66 books (Old and New Testament)
- Handle edge cases: books with numbers, alternative spellings, accents
- Add function `formatVerseIdForApi(reference: Reference): string` to convert Reference objects to API format (e.g., "MAT.5.13-MAT.5.14")
- Create `tests/unit/verse-parser.test.ts` with test cases for:
  - All 66 book names in Spanish
  - Books with numbers (1 Juan, 2 Pedro, etc.)
  - Single verses vs verse ranges
  - Invalid book names (should return null)
  - Edge cases like alternative spellings

### Step 3: Implement Bible API Client

- Create `src/lib/bible-api-client.ts` with class `BibleApiClient`
- Add constructor accepting `baseUrl`, `apiKey`, and `bibleId` (translation ID)
- Implement method `fetchVerse(reference: Reference): Promise<{ text: string, translation: string } | null>`
- Add proper TypeScript types for scripture.api.bible response format
- Implement retry logic: retry once on 5xx errors or network failures with exponential backoff
- Add timeout handling (10 seconds max per request)
- Log errors for debugging but don't expose API details to frontend
- Handle rate limiting (429 responses) gracefully with appropriate error messages

### Step 4: Create Unit Tests for API Client

- Create `tests/unit/bible-api-client.test.ts`
- Mock fetch calls using vitest mocking
- Test successful verse fetch with proper response parsing
- Test error scenarios: 404 (verse not found), 401 (invalid API key), 500 (server error), network timeout
- Test retry logic: verify retries on 5xx, no retries on 4xx
- Test verse range handling vs single verse handling
- Verify proper Authorization header is sent with API key

### Step 5: Create Provider Factory

- Create `src/lib/bible-provider-factory.ts` with function `createBibleProvider(): BibleProvider`
- Read environment variables (BIBLE_API_BASE_URL, BIBLE_API_KEY, BIBLE_DEFAULT_TRANSLATION)
- If API credentials are configured and valid, return BibleApiProvider instance
- If not configured or invalid, return MockBibleProvider instance with console warning
- Export singleton instance `bibleProvider` for consistent usage across app
- Add TypeScript types and JSDoc comments

### Step 6: Update API Route Handler

- Update `src/app/api/verse/route.ts` to use the new `BibleApiClient`
- Import and use `verse-parser.ts` functions to convert references to API format
- Remove mock response code (lines 63-74)
- Implement real API call using BibleApiClient with proper error handling
- On API errors or missing verses, try falling back to MockBibleProvider
- Set proper Cache-Control headers: `public, s-maxage=604800, stale-while-revalidate=86400` (7 days)
- Return proper JSON responses with verse text, reference, and translation
- Handle edge cases: invalid book names, API unavailable, rate limiting

### Step 7: Update TruthCard Component

- Update `src/components/TruthCard.tsx` to use provider factory instead of hardcoded MockBibleProvider
- Replace `new MockBibleProvider()` with import from `bible-provider-factory`
- Keep all existing caching logic with IndexedDBCache
- Improve error message display to be more user-friendly (remove "Mock verse not found" language)
- Add indicator when verse is from cache vs freshly fetched (optional, for transparency)
- Ensure loading states and error states are properly styled

### Step 8: Create E2E Test for Bible Verse Display

- Create `.claude/commands/e2e/test_bible_verse_display.md` following the format of existing E2E tests
- Define User Story: "As a user, I want to see actual Bible verses displayed for each truth"
- Test Steps:
  1. Navigate to application
  2. Wait for truth to load
  3. Verify Bible verse text is displayed (not "Mock verse not found")
  4. Verify verse contains actual Spanish text (check for common Spanish Bible words)
  5. Verify reference is properly formatted (e.g., "Juan 1:12")
  6. Click "Otra verdad" button to load a different truth
  7. Verify new verse is displayed correctly
  8. Take screenshots of both verses displayed
- Success Criteria: All truths display real verse text without mock errors, verses are in Spanish, references are properly formatted

### Step 9: Update Documentation

- Update `.env.sample` to include detailed Bible API setup instructions:
  - Add comment explaining how to get API key from https://scripture.api.bible
  - Document the RVR60 Bible ID: `BIBLE_DEFAULT_TRANSLATION=RVR60`
  - Add example API base URL: `BIBLE_API_BASE_URL=https://api.scripture.api.bible/v1`
  - Note that app works without API key using mock data
- Update `README.md` section "4. (Optional) Configure Bible API" (lines 71-83):
  - Add step-by-step instructions to register for API key
  - Document which translations are supported (RVR60 primary, others available)
  - Explain caching behavior and offline support
  - Add troubleshooting section for API connection issues

### Step 10: Validate with Full Test Suite

- Run all validation commands listed in "Validation Commands" section below
- Verify that E2E test for Bible verse display passes with real API
- Test with API key configured: should fetch real verses
- Test without API key (comment out in .env): should fallback to MockBibleProvider gracefully
- Check that all truths.json references work (spot check 5-10 different references)
- Verify offline functionality: disconnect network, should serve cached verses
- Confirm zero regressions in existing functionality

## Testing Strategy

### Unit Tests

**Verse Parser Tests** (`tests/unit/verse-parser.test.ts`):

- Test all 66 Bible book name conversions (Spanish → API code)
- Test numbered books: "1 Juan" → "1JN", "2 Corintios" → "2CO", etc.
- Test single verse formatting: Reference(Mateo, 5, 13) → "MAT.5.13"
- Test verse range formatting: Reference(Mateo, 5, 13, 14) → "MAT.5.13-MAT.5.14"
- Test invalid book names return null
- Test alternative spellings and Unicode handling (accents)

**Bible API Client Tests** (`tests/unit/bible-api-client.test.ts`):

- Mock fetch responses and test successful verse retrieval
- Test 404 handling (verse not found in API)
- Test 401 handling (invalid API key)
- Test 500/503 handling (server errors) with retry logic
- Test network timeout handling
- Test rate limiting (429 response)
- Test malformed API responses
- Verify proper request headers (Authorization, Content-Type)

**Integration Tests** (existing test suite):

- API route handler returns proper JSON for valid requests
- API route handler returns appropriate errors for invalid requests
- Provider factory selects correct provider based on environment configuration
- TruthCard component displays verses from both API and Mock providers

### Edge Cases

- **Book name variations**: Handle both "1 Juan" and "1Juan", "San Mateo" and "Mateo"
- **Missing verses in API**: Some verse combinations may not exist (e.g., invalid chapter/verse numbers)
- **API rate limiting**: scripture.api.bible has rate limits; handle 429 responses gracefully
- **Network failures**: Offline or slow connections should fallback to cached/mock data
- **Incomplete verse ranges**: Handle cases where verseEnd might exceed actual verses in chapter
- **Special characters**: Ensure proper encoding of Spanish characters in API requests
- **Translation availability**: Handle cases where requested translation doesn't contain specific verses
- **Empty API responses**: Handle unexpected empty or null responses from API
- **Concurrent requests**: Multiple TruthCard components loading simultaneously shouldn't overwhelm API
- **Stale cache**: Verify 7-day cache expiration works correctly

## Acceptance Criteria

- [ ] Bible API is integrated with scripture.api.bible using RVR60 translation
- [ ] All 66 Bible books are properly mapped from Spanish names to API codes
- [ ] Verse parser correctly handles single verses and verse ranges
- [ ] API route `/api/verse` fetches and returns real verse texts from scripture.api.bible
- [ ] Server-side caching reduces duplicate API calls (7-day cache duration)
- [ ] Client-side IndexedDB caching persists verses for offline access
- [ ] Application gracefully falls back to MockBibleProvider when API is unavailable or not configured
- [ ] Error messages are user-friendly and don't expose technical details
- [ ] TruthCard component displays real verses instead of "Mock verse not found" messages
- [ ] Unit tests achieve >80% coverage for verse-parser and bible-api-client modules
- [ ] E2E test validates complete verse fetching and display flow
- [ ] Documentation clearly explains how to obtain and configure API key
- [ ] Application works both with and without API key configured
- [ ] All existing truths.json references successfully fetch and display verses
- [ ] No regressions in existing functionality (other features still work)
- [ ] Loading states and error states are properly styled in UI

## Validation Commands

Execute every command to validate the feature works correctly with zero regressions.

- Read `.claude/commands/test_e2e.md`, then read and execute the new E2E `.claude/commands/e2e/test_bible_verse_display.md` test file to validate Bible verse fetching and display works end-to-end
- `cd /Users/esteban.camacho/Projects/agentic-coding/code/truthseed-app/trees/c5c51e28 && pnpm test:unit` - Run all unit tests including new verse-parser and bible-api-client tests to ensure >80% coverage
- `cd /Users/esteban.camacho/Projects/agentic-coding/code/truthseed-app/trees/c5c51e28 && pnpm typecheck` - Run TypeScript type checking to validate all types are correct with zero errors
- `cd /Users/esteban.camacho/Projects/agentic-coding/code/truthseed-app/trees/c5c51e28 && pnpm build` - Run production build to validate the feature works in production mode with zero errors
- `cd /Users/esteban.camacho/Projects/agentic-coding/code/truthseed-app/trees/c5c51e28 && pnpm lint` - Run ESLint to ensure code follows project conventions
- Manual validation: Test the app with BIBLE_API_KEY configured and verify real verses are displayed
- Manual validation: Test the app without BIBLE_API_KEY (comment it out in .env) and verify fallback to MockBibleProvider works
- Manual validation: Spot check 5-10 different truths to ensure various biblical references fetch correctly
- Manual validation: Test offline functionality by disconnecting network after loading some verses, then verify cached verses still display

## Notes

### Bible Translation IDs

The scripture.api.bible uses specific IDs for translations. Common Spanish translations:

- RVR60 (Reina-Valera 1960): Bible ID likely "592420522e16049f-01" (verify during implementation)
- NVI (Nueva Versión Internacional): Available as alternative (Bible ID to be determined if needed)

### Rate Limiting

scripture.api.bible free tier typically allows:

- 500 requests per day (verify current limits in their docs)
- Caching strategy is critical to stay within limits
- Server-side cache (Next.js fetch cache) + client-side cache (IndexedDB) = minimal API calls

### Book Name Mapping Reference

Key books that need special handling:

- Numbered books: "1 Juan", "2 Juan", "3 Juan", "1 Pedro", "2 Pedro", "1 Corintios", "2 Corintios", "1 Tesalonicenses", "2 Tesalonicenses", "1 Timoteo", "2 Timoteo"
- Books with accents: "Génesis", "Éxodo", "Números", "Habacuc"
- Alternative names: "Santiago" (James), "Apocalipsis" (Revelation), "Filemón" (Philemon)

### Future Enhancements (not in scope for this feature)

- Support for multiple translations (NVI, TLA, etc.)
- User preference for translation selection
- Audio playback of verses (requires text-to-speech or audio API)
- Verse highlighting or annotation features
- Search functionality for verses across all truths
- Share verse functionality (copy to clipboard, social media)

### Dependencies

No new npm packages required. The feature uses:

- Built-in `fetch` API for HTTP requests
- Existing `zod` for validation
- Existing `IndexedDBCache` for client-side caching
- Next.js built-in caching for server-side responses
