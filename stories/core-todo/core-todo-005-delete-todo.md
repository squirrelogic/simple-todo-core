# Story: Delete Todo Item

**ID**: core-todo-005
**Status**: Draft
**Priority**: High
**Points**: 2

## User Story
As a user
I want to delete individual todos
So that I can remove tasks that are no longer relevant

## Acceptance Criteria
- [ ] Delete button (X) appears on hover/focus for each todo
- [ ] Delete button is always visible on touch devices
- [ ] Clicking delete shows confirmation dialog
- [ ] Confirming removes todo immediately
- [ ] Canceling preserves the todo
- [ ] Todo fades out with animation on deletion (200ms)
- [ ] List reflows smoothly after deletion
- [ ] Can delete todos using Delete key when focused
- [ ] Screen reader announces deletion

## Technical Notes
- Create IconButton component for delete action
- Implement confirmation dialog component
- Add delete handler with optimistic update
- Use CSS transition for fade-out animation
- Remove todo from state and localStorage
- Handle keyboard events (Delete key)
- Add ARIA labels for delete action
- Consider undo functionality for v2.0

## Dependencies
- Depends on: core-todo-001, core-todo-002
- Blocks: core-todo-007

## Tasks
- [ ] Create IconButton component
- [ ] Add delete button to TodoItem
- [ ] Create ConfirmDialog component
- [ ] Implement delete handler
- [ ] Add fade-out animation
- [ ] Implement keyboard support (Delete key)
- [ ] Add hover/focus styles for delete button
- [ ] Write unit tests for delete functionality
- [ ] Write integration test for deletion flow
- [ ] Test accessibility of confirmation dialog