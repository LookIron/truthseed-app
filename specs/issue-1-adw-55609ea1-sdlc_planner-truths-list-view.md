# Feature: Truths List View

## Metadata

issue_number: `1`
adw_id: `55609ea1`
issue_json: `{"number":1,"title":"Add a button to see the list of Truths","body":"/feature\n\nadw_sdlc_iso\n\nCreate a button next to the \"Otra Verdad\" button, to go to another screen where the user can see a list with All the Truths, each item in the list should have the title, the bible verse(ejemple Juan 3: 14) and the tags"}`

## Feature Description

This feature adds a comprehensive list view of all available biblical truths in the TruthSeed application. Users will be able to navigate from the random truth display to a dedicated screen showing all truths, enabling them to browse, discover, and access specific truths directly rather than relying solely on the random selection. Each list item will display the truth's title, primary biblical reference (e.g., "Juan 3:14"), and associated tags for easy scanning and identification.

## User Story

As a TruthSeed user
I want to view a complete list of all available biblical truths with their references and tags
So that I can browse, discover, and select specific truths that resonate with my current spiritual needs

## Problem Statement

Currently, TruthSeed only displays random truths one at a time. Users who want to explore all available truths, search for specific topics via tags, or revisit a previously seen truth have no way to do so. This limitation reduces the app's utility and prevents users from intentionally engaging with specific biblical truths that might be relevant to their current spiritual journey.

## Solution Statement

We will create a new route `/truths` with a list view page that displays all truths from `truths.json`. A new button will be added to the home page alongside the "Otra Verdad" button, allowing users to navigate to this list view. The list will show each truth as a card or list item displaying the title, primary biblical reference (formatted display string), and tags. Users can click individual truth items to view the full truth details. The implementation will follow Next.js 15 App Router conventions and maintain the existing design system using Tailwind CSS.

## Relevant Files

Use these files to implement the feature:

- `src/app/page.tsx` - Home page where the new navigation button will be added next to "Otra Verdad" button
- `src/components/TruthCard.tsx` - Reference for styling and component patterns; may inform how list items are displayed
- `src/content/truths.json` - Data source containing all truths that will be displayed in the list
- `src/domain/models/Truth.ts` - Truth type definition and schema for type safety
- `src/domain/models/Reference.ts` - Reference model for formatting biblical references (display property)
- `src/app/layout.tsx` - Root layout for understanding app structure and styling patterns
- `src/app/globals.css` - Global styles and Tailwind configuration to maintain design consistency
- `.claude/commands/test_e2e.md` - E2E test runner documentation to understand testing framework
- `.claude/commands/e2e/test_basic_query.md` - Example E2E test structure for creating our new test

### New Files

- `src/app/truths/page.tsx` - New page component that displays the list of all truths
- `src/components/TruthListItem.tsx` - New component for rendering individual truth items in the list (displays title, reference, and tags)
- `.claude/commands/e2e/test_truths_list_view.md` - E2E test specification for validating the truths list view functionality
- `tests/unit/components/TruthListItem.test.tsx` - Unit tests for the TruthListItem component

## Implementation Plan

### Phase 1: Foundation

First, we'll create the core list item component that will display each truth in a compact, scannable format. This component will show the truth's title, primary biblical reference using the existing `formatReference` utility, and tags. We'll ensure it follows the existing design patterns from TruthCard.tsx and uses Tailwind CSS for styling consistency.

### Phase 2: Core Implementation

Next, we'll create the `/truths` route page that fetches all truths from `truths.json` and renders them using the TruthListItem component. The page will include proper loading states, error handling, and responsive layout. We'll implement client-side rendering for interactive features while maintaining good performance.

### Phase 3: Integration

Finally, we'll add the navigation button to the home page (src/app/page.tsx) that allows users to navigate to the truths list view. The button will be placed next to the existing "Otra Verdad" button with consistent styling. We'll also implement navigation from list items back to individual truths if needed, and create comprehensive E2E tests to validate the complete user flow.

## Step by Step Tasks

### Task 1: Create TruthListItem Component

- Create `src/components/TruthListItem.tsx` component
- Accept a `Truth` object as a prop
- Display the truth title prominently
- Show the first reference using `formatReference(truth.references[0])` to display the biblical reference (e.g., "Juan 3:14")
- Render tags as small badges similar to the full TruthCard
- Use Tailwind CSS classes consistent with existing components (card, hover states, responsive design)
- Make the entire item clickable/tappable with hover effects for better UX
- Implement proper TypeScript typing using the Truth type from domain models

### Task 2: Create Unit Tests for TruthListItem

- Create `tests/unit/components/TruthListItem.test.tsx`
- Test that component renders with required props
- Verify title, reference, and tags are displayed correctly
- Test with truths that have single vs multiple tags
- Test with truths that have single verse vs verse ranges
- Ensure proper formatting of biblical references
- Verify hover states and accessibility

### Task 3: Create Truths List Page

- Create `src/app/truths/page.tsx` as a new Next.js page
- Import truths data from `@/content/truths.json`
- Create a client component ('use client') for interactivity
- Render all truths using the TruthListItem component in a responsive grid or list layout
- Add a header with the page title "Todas las Verdades" or similar
- Include a back button or link to return to the home page
- Implement proper loading states
- Add error boundaries for robustness
- Ensure mobile-responsive layout (single column on mobile, multi-column on larger screens)

### Task 4: Add Navigation Button to Home Page

- Edit `src/app/page.tsx`
- Add a new button next to the "Otra Verdad" button
- Label it "Ver Todas" or "Lista de Verdades"
- Use Next.js Link component for client-side navigation to `/truths`
- Style it consistently with the existing "Otra Verdad" button using the same btn classes
- Include an appropriate icon (e.g., list icon) similar to how "Otra Verdad" has a refresh icon
- Ensure proper spacing and responsive layout for both buttons

### Task 5: Create E2E Test Specification

- Create `.claude/commands/e2e/test_truths_list_view.md`
- Follow the format from `test_basic_query.md` and `test_complex_query.md`
- Define User Story: As a user, I want to navigate to a list of all truths and view their details
- Define Test Steps:
  1. Navigate to home page
  2. Take screenshot of initial state
  3. Verify the "Ver Todas" or "Lista de Verdades" button exists
  4. Click the navigation button
  5. Verify navigation to `/truths` route
  6. Verify page title/header is displayed
  7. Take screenshot of the truths list view
  8. Verify all truths are rendered (count should match truths.json length)
  9. Verify each list item shows title, reference, and tags
  10. Take screenshot of a specific truth item (scroll to one if needed)
  11. Verify back button/link exists
  12. Click back button to return to home
  13. Verify returned to home page
  14. Take screenshot of final state
- Define Success Criteria:
  - Navigation button is visible and clickable
  - List view displays all truths correctly
  - Each truth shows title, biblical reference, and tags
  - Back navigation works properly
  - Screenshots capture the full flow

### Task 6: Style and Polish

- Review all new components for consistent spacing, colors, and typography
- Ensure hover and active states work properly on all interactive elements
- Test responsive behavior on mobile, tablet, and desktop viewports
- Verify accessibility (keyboard navigation, ARIA labels, screen reader compatibility)
- Ensure proper focus management when navigating between pages
- Add transition animations if appropriate (consistent with existing page transitions)

### Task 7: Run Validation Commands

- Execute all validation commands listed below to ensure zero regressions
- Read `.claude/commands/test_e2e.md` to understand the E2E test runner
- Read and execute the new E2E test `.claude/commands/e2e/test_truths_list_view.md`
- Verify all tests pass
- Review screenshots from E2E tests to confirm UI looks correct
- Fix any issues found during validation

## Testing Strategy

### Unit Tests

- **TruthListItem Component Tests**:
  - Renders correctly with valid Truth props
  - Displays title text accurately
  - Formats and displays the first biblical reference using formatReference()
  - Renders all tags as badge elements
  - Handles truths with no tags gracefully
  - Handles truths with single verse (e.g., "Juan 1:12") and verse ranges (e.g., "Romanos 8:1-2")
  - Component is accessible (proper semantic HTML, ARIA labels)

- **Truths List Page Tests** (if time permits):
  - Page loads and renders without errors
  - Displays all truths from truths.json
  - Back navigation link is present

### Edge Cases

- **Empty tags array**: Truth items with no tags should render cleanly without the tags section
- **Long titles**: Truth titles that are very long should wrap or truncate gracefully
- **Single verse vs range**: References like "Juan 1:12" and "Romanos 8:1-2" should both format correctly
- **Mobile viewport**: List should display properly in single column on small screens
- **Large dataset**: With current ~6-10 truths, performance is fine, but layout should handle 50+ truths without breaking
- **Navigation state**: Clicking back button should return to home page in the same state
- **Multiple references**: Truths with multiple references should show only the first one in the list view
- **Dark mode**: If the app supports dark mode, ensure list view renders correctly

## Acceptance Criteria

1. A new button labeled "Ver Todas" or "Lista de Verdades" appears next to the "Otra Verdad" button on the home page
2. Clicking the button navigates to a new `/truths` route
3. The truths list page displays ALL truths from `truths.json` in a scannable list or grid format
4. Each truth item displays:
   - The truth title (e.g., "Soy aceptado: Soy hijo de Dios")
   - The primary biblical reference in display format (e.g., "Juan 1:12")
   - All associated tags as small badges
5. The list is responsive and works well on mobile, tablet, and desktop
6. A back button or link allows users to return to the home page
7. The design is consistent with the existing TruthSeed visual style
8. All existing functionality (random truth display, "Otra Verdad" button) continues to work without regression
9. The E2E test validates the complete navigation flow and list display
10. All unit tests pass with >80% coverage for new components

## Validation Commands

Execute every command to validate the feature works correctly with zero regressions.

- Read `.claude/commands/test_e2e.md` to understand how to run E2E tests
- Read and execute `.claude/commands/e2e/test_truths_list_view.md` to validate the truths list view functionality works as expected
- `pnpm test:unit` - Run all unit tests including new TruthListItem tests
- `pnpm typecheck` - Run TypeScript type checking to ensure no type errors
- `pnpm lint` - Run ESLint to ensure code quality standards
- `pnpm build` - Build the application to ensure no build errors

## Notes

- The feature leverages existing `truths.json` data without requiring backend changes
- Uses Next.js 15 App Router file-based routing (src/app/truths/page.tsx)
- The `formatReference` utility from `@/domain/models/Reference` should be used to format biblical references consistently
- Consider adding a search/filter feature in a future iteration (not part of this feature)
- The list view currently shows all truths; future enhancement could add category filtering
- The TruthListItem component could later be enhanced to link to individual truth detail pages
- No new dependencies required - uses existing Next.js, React, and Tailwind CSS
- The E2E test should use Playwright MCP server for browser automation
- Ensure proper semantic HTML for accessibility (nav, main, article/section tags)
- Consider adding a count indicator (e.g., "Mostrando 15 verdades") for better UX
