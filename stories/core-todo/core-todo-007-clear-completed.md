# Story: Clear Completed Todos

**ID**: core-todo-007
**Status**: Draft
**Priority**: Medium
**Points**: 2

## User Story
As a user
I want to remove all completed todos at once
So that I can clean up my list efficiently

## Acceptance Criteria
- [ ] "Clear completed" button appears in footer
- [ ] Button is disabled when no completed todos exist
- [ ] Button shows count of items to be cleared
- [ ] Clicking button shows confirmation dialog
- [ ] Confirming removes all completed todos
- [ ] Todos fade out simultaneously with animation
- [ ] Active todo count updates immediately
- [ ] Operation only affects todos in current filter view
- [ ] Screen reader announces number cleared

## Technical Notes
- Add clearCompleted handler to todo state
- Filter todos by completed status
- Implement bulk delete with animation
- Update button disabled state reactively
- Show count in button text (e.g., "Clear completed (5)")
- Use same ConfirmDialog as delete operation
- Batch state updates for performance
- Add appropriate ARIA labels

## Dependencies
- Depends on: core-todo-003, core-todo-005
- Blocks: None

## Tasks
- [ ] Add "Clear completed" button to footer
- [ ] Implement completed todo count logic
- [ ] Create clearCompleted handler
- [ ] Add confirmation dialog integration
- [ ] Implement bulk fade-out animation
- [ ] Add disabled state styling
- [ ] Write unit tests for clear logic
- [ ] Write integration test for bulk clear
- [ ] Test with various filter states
- [ ] Verify accessibility of bulk operation