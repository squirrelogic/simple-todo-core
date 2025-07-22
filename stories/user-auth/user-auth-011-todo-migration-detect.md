# Story: Todo Migration Detection

**ID**: user-auth-011
**Status**: Draft
**Priority**: High
**Points**: 3

## User Story
As a new user with existing localStorage todos
I want the app to detect my existing todos
So that I can choose to migrate them to my new account

## Acceptance Criteria
- [ ] Check for localStorage todos after signup/first login
- [ ] Count of existing todos displayed
- [ ] Preview of first 5 todos shown
- [ ] Clear explanation of migration benefits
- [ ] "Migrate Now" primary action button
- [ ] "Skip" secondary option available
- [ ] "Remind me later" stores preference
- [ ] Migration prompt only shown once per session
- [ ] Skipped migration can be triggered from settings
- [ ] No prompt if localStorage is empty
- [ ] Detection works across all browsers
- [ ] Large todo lists (>100) show warning

## Technical Notes
- Check localStorage key 'simple-todo-data' after auth
- Parse and validate todo data structure
- Count total todos and calculate size
- Store migration prompt status in session
- Create migration preview component
- Handle corrupted localStorage gracefully
- Check todos don't already exist (by ID)
- Estimate migration time for large lists
- Log migration opportunity for analytics
- Support browser privacy modes

## Dependencies
- Depends on: user-auth-001, user-auth-003, core-todo-009 (need auth and localStorage)
- Blocks: user-auth-012 (detection before migration)

## Tasks
- [ ] Create localStorage detection utility
- [ ] Build migration prompt component
- [ ] Implement todo preview display
- [ ] Add migration benefits messaging
- [ ] Create skip/remind preference storage
- [ ] Handle various localStorage states
- [ ] Add migration entry in settings
- [ ] Implement size/count calculations
- [ ] Write unit tests for detection
- [ ] Test with various todo quantities
- [ ] Test browser compatibility
- [ ] Handle edge cases gracefully