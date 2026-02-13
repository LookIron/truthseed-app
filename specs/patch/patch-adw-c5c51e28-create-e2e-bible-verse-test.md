# Patch: Create E2E Test for Bible Verse Display

## Metadata

adw_id: `c5c51e28`
review_change_request: `Issue #5: No E2E test created - The spec requires creating .claude/commands/e2e/test_bible_verse_display.md but this file does not exist Resolution: Create E2E test as described in Step 8 of the implementation plan Severity: blocker`

## Issue Summary

**Original Spec:** specs/issue-10-adw-c5c51e28-sdlc_planner-integrate-bible-api.md
**Issue:** Step 8 of the implementation plan requires creating `.claude/commands/e2e/test_bible_verse_display.md` E2E test file, but this file does not exist
**Solution:** Create the E2E test file following the format of existing E2E tests (test_truths_list_view.md) to validate Bible verse fetching and display functionality

## Files to Modify

Use these files to implement the patch:

- **.claude/commands/e2e/test_bible_verse_display.md** - New E2E test file to validate Bible verse display

## Implementation Steps

IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create E2E test file

- Create `.claude/commands/e2e/test_bible_verse_display.md` following the format of existing E2E tests
- Define User Story: "As a user, I want to see actual Bible verses displayed for each truth"
- Include test steps to validate Bible verse fetching and display
- Define success criteria based on Step 8 requirements from the spec

### Step 2: Define comprehensive test steps

- Navigate to application home page
- Wait for truth card to load with verse content
- Verify Bible verse text is displayed (not "Mock verse not found")
- Verify verse contains Spanish text (check for common Spanish Bible words)
- Verify reference is properly formatted (e.g., "Juan 1:12")
- Click "Otra verdad" button to load a different truth
- Verify new verse displays correctly
- Take screenshots of both verses displayed

### Step 3: Add success criteria

- All truths display real verse text without mock errors
- Verses are in Spanish language
- References are properly formatted
- Screenshots capture complete verse display flow

## Validation

Execute every command to validate the patch is complete with zero regressions.

- `cd /Users/esteban.camacho/Projects/agentic-coding/code/truthseed-app/trees/c5c51e28 && ls -la .claude/commands/e2e/test_bible_verse_display.md` - Verify file exists
- `cd /Users/esteban.camacho/Projects/agentic-coding/code/truthseed-app/trees/c5c51e28 && cat .claude/commands/e2e/test_bible_verse_display.md` - Review file contents
- Read `.claude/commands/test_e2e.md`, then read and execute the new E2E `.claude/commands/e2e/test_bible_verse_display.md` test file to validate Bible verse fetching and display works end-to-end

## Patch Scope

**Lines of code to change:** ~50 lines (new file)
**Risk level:** low
**Testing required:** Execute the new E2E test to validate Bible verse display functionality
