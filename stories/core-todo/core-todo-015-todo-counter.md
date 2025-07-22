# Story: Active Todo Counter

**ID**: core-todo-015
**Status**: Draft
**Priority**: Low
**Points**: 1

## User Story
As a user
I want to see how many active todos I have
So that I can track my overall progress

## Acceptance Criteria
- [ ] Counter shows number of active (not completed) todos
- [ ] Counter updates immediately when todos change
- [ ] Shows "X items left" format
- [ ] Uses singular "item" for count of 1
- [ ] Counter respects current filter view
- [ ] Located in the footer area
- [ ] Updates smoothly without flicker
- [ ] Accessible to screen readers

## Technical Notes
- Create TodoCounter component
- Calculate count from filtered todos
- Use proper pluralization logic
- Implement with semantic HTML
- Add ARIA live region for updates
- Use memoization for performance
- Style consistently with design

## Dependencies
- Depends on: core-todo-003, core-todo-006
- Blocks: None

## Tasks
- [ ] Create TodoCounter component
- [ ] Implement count calculation logic
- [ ] Add pluralization handling
- [ ] Style counter display
- [ ] Add ARIA live region
- [ ] Write unit tests for counter
- [ ] Test with various todo states
- [ ] Verify screen reader announcement