# E2E Test: Bible Verse Display

Test the Bible verse fetching and display functionality in the TruthSeed application.

## User Story

As a user
I want to see actual Bible verses displayed for each truth
So that I can read the biblical foundation for each spiritual truth

## Test Steps

1. Navigate to the `Application URL`
2. Take a screenshot of the home page initial state
3. **Verify** the page title contains "TruthSeed"
4. Wait for the truth card to fully load with verse content (up to 5 seconds)
5. **Verify** the truth card displays:
   - A title text
   - A Bible verse text (Spanish)
   - A biblical reference (e.g., "Juan 1:12")

6. **Verify** the Bible verse text is NOT "Mock verse not found"
7. **Verify** the Bible verse text contains Spanish language content by checking for common Spanish words:
   - Check for Spanish articles: "el", "la", "los", "las", "un", "una"
   - Check for Spanish verbs: "es", "son", "está", "están", "ha", "han"
   - Check for Spanish prepositions: "de", "en", "a", "para", "por"

8. **Verify** the biblical reference is properly formatted (e.g., "Juan 1:12", "Romanos 8:1")
9. Take a screenshot showing the complete verse display
10. Click the "Otra verdad" button to load a different truth
11. Wait for the new truth card to fully load with verse content (up to 5 seconds)
12. **Verify** the new truth card displays a different verse
13. **Verify** the new verse text is also NOT "Mock verse not found"
14. **Verify** the new verse also contains Spanish language content
15. **Verify** the new biblical reference is properly formatted
16. Take a screenshot showing the second verse display
17. Click "Otra verdad" again to test a third truth
18. **Verify** the third truth also displays correctly
19. Take a screenshot of the final state

## Success Criteria

- All truths display real verse text without mock errors or fallback messages
- Verses are in Spanish language (validated by checking for Spanish words)
- Biblical references are properly formatted with book name and verse numbers
- Verse content changes when "Otra verdad" button is clicked
- No loading errors or API failures occur
- Screenshots capture complete verse display flow showing multiple different verses
