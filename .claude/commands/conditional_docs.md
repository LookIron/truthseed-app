# Conditional Documentation Guide

This prompt helps you determine what documentation you should read based on the specific changes you need to make in the codebase. Review the conditions below and read the relevant documentation before proceeding with your task.

## Instructions

- Review the task you've been asked to perform
- Check each documentation path in the Conditional Documentation section
- For each path, evaluate if any of the listed conditions apply to your task
  - IMPORTANT: Only read the documentation if any one of the conditions match your task
- IMPORTANT: You don't want to excessively read documentation. Only read the documentation if it's relevant to your task.

## Conditional Documentation

- README.md
  - Conditions:
    - When operating on anything under app/server
    - When operating on anything under app/client
    - When first understanding the project structure
    - When you want to learn the commands to start or stop the server or client

- app/client/src/style.css
  - Conditions:
    - When you need to make changes to the client's style

- .claude/commands/classify_adw.md
  - Conditions:
    - When adding or removing new `adws/adw_*.py` files

- adws/README.md
  - Conditions:
    - When you're operating in the `adws/` directory

- app_docs/feature-490eb6b5-one-click-table-exports.md
  - Conditions:
    - When working with CSV export functionality
    - When implementing table or query result export features
    - When troubleshooting download button functionality
    - When working with pandas-based data export utilities

- app_docs/feature-4c768184-model-upgrades.md
  - Conditions:
    - When working with LLM model configurations
    - When updating OpenAI or Anthropic model versions
    - When troubleshooting SQL query generation accuracy
    - When working with the llm_processor module

- app_docs/feature-f055c4f8-off-white-background.md
  - Conditions:
    - When working with application background styling
    - When modifying CSS color variables or themes
    - When implementing visual design changes to the client application

- app_docs/feature-6445fc8f-light-sky-blue-background.md
  - Conditions:
    - When working with light sky blue background styling
    - When implementing background color changes to light blue variants
    - When troubleshooting visual hierarchy with light blue backgrounds

- app_docs/feature-cc73faf1-upload-button-text.md
  - Conditions:
    - When working with upload button text or labeling
    - When implementing UI text changes for data upload functionality
    - When troubleshooting upload button display or terminology

- app_docs/feature-e0066ae3-complete-truths-update.md
  - Conditions:
    - When working with src/content/truths.json
    - When implementing biblical truths content updates
    - When troubleshooting truth data structure or schema
    - When working with Truth model validation
    - When adding or modifying biblical truth entries

- app_docs/feature-c5c51e28-bible-api-integration.md
  - Conditions:
    - When working with Bible API integration or verse fetching
    - When implementing or modifying src/lib/bible-api-client.ts
    - When implementing or modifying src/lib/verse-parser.ts
    - When implementing or modifying src/lib/bible-provider-factory.ts
    - When troubleshooting verse display or API errors
    - When working with src/app/api/verse/route.ts
    - When configuring Bible API environment variables
    - When implementing fallback between BibleApiProvider and MockBibleProvider
    - When working with Spanish biblical book name parsing
    - When troubleshooting caching for Bible verses

- app_docs/feature-12-bible-api-replacement.md
  - Conditions:
    - When working with docs-bible-api integration
    - When understanding the migration from scripture.api.bible to docs-bible-api
    - When troubleshooting Bible verse fetching without API keys
    - When implementing changes to Bible API client or verse parser
    - When working with lowercase Spanish book names in Bible references
    - When configuring Bible translations (nvi, rv60)
    - When understanding the removal of MockBibleProvider
    - When working with path-based verse ID format (e.g., mateo/5/13-14)

- app_docs/feature-14-verse-display-fix-and-translation-selector.md
  - Conditions:
    - When working with Bible verse display issues or parameter validation
    - When implementing translation selection or multi-translation support
    - When troubleshooting "Invalid params" errors in verse API route
    - When working with src/components/TranslationSelector.tsx
    - When working with src/lib/translation-storage.ts
    - When implementing localStorage-based user preferences
    - When handling API response format variations (single object vs array)
    - When configuring supported Bible translations (rv1960, rv1995, nvi, dhh, pdt, kjv)
    - When troubleshooting verse re-fetching or dynamic translation switching
