# Bug: Update Truths List with Original Content

## Metadata

issue_number: `ba7a352e`
adw_id: `3`
issue_json: `{"number":3,"title":"update the truths list","body":"/bug\n\nadw_sdlc_zte_iso\n\nThe truths are harcoded with a different list, the original list is in the next two images, so, we need to add the list defined in the images, with their bible verse.\n\n![Image](https://github.com/user-attachments/assets/f5c9f8a3-3ca6-4638-bf1a-91bb564e1c6e)\n![Image](https://github.com/user-attachments/assets/a5caf09b-ea37-44e8-a791-12b65b055a77)"}`

## Bug Description

The truths list in `src/content/truths.json` is currently hardcoded with a different set of truths than the original intended content. The issue references two images that contain the original truths list with their corresponding Bible verses. The current implementation has placeholder/test data instead of the actual truths that should be displayed to users.

## Problem Statement

The application is displaying an incorrect set of biblical truths to users. The current `truths.json` file contains 10 truths that do not match the original, intended content provided in the referenced images. This means users are seeing the wrong spiritual content, which undermines the core purpose of the TruthSeed application.

## Solution Statement

Extract the original truths list from the referenced images in the GitHub issue and update `src/content/truths.json` with the correct content, ensuring each truth includes:

- Proper ID formatting (lowercase with hyphens)
- Spanish title and renounce statement
- Correct category classification
- Accurate Bible verse references (book, chapter, verse range)
- Appropriate tags for categorization

The solution will validate the updated content against the existing Zod schemas to ensure data integrity.

## Steps to Reproduce

1. Navigate to http://localhost:5173 (or deployed URL)
2. Click "Ver Todas" button to view all truths
3. Observe the current list of 10 truths
4. Compare with the original truths shown in the GitHub issue images
5. Note the discrepancy between displayed truths and intended original content

## Root Cause Analysis

The root cause is that `src/content/truths.json` was populated with sample/test data during initial development rather than the actual truths intended for production use. The file needs to be updated to reflect the original content as specified in the provided images. This is a straightforward data content issue rather than a code logic bug.

## Relevant Files

Use these files to fix the bug:

- `src/content/truths.json` (line 1-169) - The main truths data file that needs to be updated with the correct original content from the images
  - Currently contains 10 sample truths
  - Must be replaced with the truths shown in the referenced GitHub issue images
  - Each truth must maintain the required schema structure

- `src/domain/models/Truth.ts` (line 1-56) - Truth schema definition to validate the updated content
  - Defines the Zod schema for Truth validation
  - Ensures each truth has required fields: id, title, renounceStatement, category, references, tags
  - Category must be one of: accepted, secure, significant, identity, freedom, loved

- `scripts/validate-content.ts` - Content validation script to verify the updated truths.json
  - Validates the truths.json file against the TruthsFileSchema
  - Must be run after updating the content to ensure schema compliance

### New Files

- `.claude/commands/e2e/test_updated_truths_list.md` - E2E test to validate the updated truths list displays correctly
  - Will verify the new truths are rendered on the truths list page
  - Will validate that truth count matches the updated list
  - Will capture screenshots of the updated truths for visual verification

## Step by Step Tasks

### Retrieve Original Truths Content from Images

- Fetch the images from the GitHub issue URLs
- Extract the complete truths list with all details (titles, Bible verses, categories)
- Document the extracted truths in a structured format matching the required schema
- Verify all Bible verse references are accurate and complete
- Identify the appropriate category (accepted, secure, significant, identity, freedom, loved) for each truth
- Create appropriate tags for each truth based on its content and themes

### Update truths.json with Original Content

- Back up the current `src/content/truths.json` file
- Replace the current truths array with the original truths extracted from the images
- Ensure each truth has a unique, lowercase-with-hyphens ID
- Format each truth according to the TruthSchema requirements:
  - `id`: lowercase string with hyphens
  - `title`: Spanish title following pattern "Category: Statement"
  - `renounceStatement`: Spanish renunciation and affirmation statement
  - `category`: one of the valid TruthCategory values
  - `references`: array with at least one Reference object (book, chapter, verseStart, verseEnd if applicable, display, translation)
  - `tags`: array of relevant tag strings
- Maintain proper JSON formatting with consistent indentation

### Update Mock Bible Provider (if needed)

- Read `src/infrastructure/bible/MockBibleProvider.ts`
- Check if any new Bible verse references need to be added to the `mockVerses` map
- Add mock verse text for any new references that aren't already present
- Ensure all verse references from the updated truths have corresponding mock data

### Create E2E Test for Updated Truths

- Read `.claude/commands/e2e/test_basic_query.md` and `.claude/commands/e2e/test_truths_list_view.md` to understand E2E test format
- Create new E2E test file `.claude/commands/e2e/test_updated_truths_list.md`
- Test should verify:
  - Navigation to /truths page works
  - Page header displays "Todas las Verdades"
  - Truth count reflects the updated number of truths
  - Each truth item displays correctly with title, reference, and tags
  - All updated truths are visible in the list
  - Screenshots capture the updated truths list for visual validation
- Include specific verification steps to prove the new truths are displayed correctly

### Run Validation Commands

- Execute all validation commands listed in the "Validation Commands" section
- Verify schema validation passes
- Verify TypeScript compilation succeeds
- Verify build completes without errors
- Verify all tests pass including the new E2E test
- Capture and address any errors that occur

## Validation Commands

Execute every command to validate the bug is fixed with zero regressions.

- `bun run validate:content` - Validate the updated truths.json against the Zod schema to ensure all truths are properly formatted
- `cd app/client && bun tsc --noEmit` - Run TypeScript type checking to verify no type errors were introduced
- `cd app/client && bun run build` - Build the application to ensure the updated truths.json is valid and doesn't break the build
- Read `.claude/commands/test_e2e.md`, then read and execute the new `.claude/commands/e2e/test_updated_truths_list.md` test file to validate the updated truths display correctly
- Navigate to http://localhost:5173/truths and manually verify the updated truths are displayed with correct content and formatting

## Notes

- The GitHub issue images must be retrieved and analyzed carefully to extract the exact original truths
- The images are hosted at:
  - https://github.com/user-attachments/assets/f5c9f8a3-3ca6-4638-bf1a-91bb564e1c6e
  - https://github.com/user-attachments/assets/a5caf09b-ea37-44e8-a791-12b65b055a77
- All Bible verse references must use the RVR60 (Reina-Valera 1960) translation as specified in the application
- Spanish language must be maintained for all titles and renounce statements
- The fix is purely a data content update; no code changes should be necessary unless the MockBibleProvider needs additional verses
- Consider whether the number of truths will change (currently 10) and ensure the UI properly handles the new count
- After updating, verify that the random truth selector on the home page also displays the new truths correctly
