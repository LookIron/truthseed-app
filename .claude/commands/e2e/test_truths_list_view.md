# E2E Test: Truths List View

Test the truths list view functionality in the TruthSeed application.

## User Story

As a TruthSeed user
I want to navigate to a list of all truths and view their details
So that I can browse and discover specific biblical truths

## Test Steps

1. Navigate to the `Application URL`
2. Take a screenshot of the home page initial state
3. **Verify** the page title contains "TruthSeed"
4. **Verify** core UI elements are present on home page:
   - "Otra verdad" button
   - "Ver Todas" button
   - Truth card with content

5. Click the "Ver Todas" button
6. **Verify** navigation to `/truths` route
7. Take a screenshot of the truths list page
8. **Verify** page header displays "Todas las Verdades"
9. **Verify** page shows count of truths (e.g., "Explora 10 verdades sobre tu identidad en Cristo")
10. **Verify** "Volver" (back) button is present
11. **Verify** all truths are rendered (count should match total truths)
12. **Verify** each truth list item displays:
    - Title text
    - Biblical reference (e.g., "Juan 1:12")
    - Tags (e.g., "#identity", "#adoption")

13. Take a screenshot showing multiple truth items in the list
14. Click the "Volver" button
15. **Verify** navigation back to home page (route is `/`)
16. **Verify** home page content is displayed again
17. Take a screenshot of the final state

## Success Criteria

- "Ver Todas" navigation button is visible and clickable on home page
- List view displays all truths correctly with proper count
- Each truth item shows title, biblical reference, and tags
- Truth items have proper styling (cards with hover effects)
- Back navigation ("Volver" button) works and returns to home page
- Page is responsive and displays correctly
- All screenshots capture the complete flow
