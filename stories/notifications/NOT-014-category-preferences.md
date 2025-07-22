# Story: Category-Based Preferences

**ID**: notifications-014
**Status**: Draft
**Priority**: Medium
**Points**: 2

## User Story
As a user
I want to configure notifications per category
So that I only receive the types of notifications I care about

## Acceptance Criteria
- [ ] Toggle notifications by category (due dates, overdue, digest, etc.)
- [ ] Set different channels per category
- [ ] Configure timing per category
- [ ] Visual preview of category notifications
- [ ] Bulk enable/disable options
- [ ] Category descriptions and examples
- [ ] Save preferences immediately
- [ ] Import/export preference profiles

## Technical Notes
- Extend preference model for categories
- Create category configuration UI
- Implement preference inheritance
- Use feature flags for new categories
- Cache category preferences
- Version preferences for migrations

## Dependencies
- Depends on: NOT-002 (Preference center)
- Blocks: None

## Tasks
- [ ] Define notification categories
- [ ] Extend preference data model
- [ ] Create category preferences UI
- [ ] Implement per-category logic
- [ ] Add category descriptions
- [ ] Create bulk operations
- [ ] Test preference combinations
- [ ] Add import/export feature
- [ ] Document categories