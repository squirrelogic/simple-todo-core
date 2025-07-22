# Story: Toggle Todo Completion

**ID**: core-todo-003
**Status**: Draft
**Priority**: High
**Points**: 2

## User Story
As a user
I want to mark todos as complete or incomplete
So that I can track my progress on tasks

## Acceptance Criteria
- [ ] Checkbox is displayed to the left of each todo
- [ ] Single click/tap toggles completion status
- [ ] Visual feedback shows completion immediately (strikethrough + gray)
- [ ] Checkbox shows checked state when todo is completed
- [ ] Completion state persists across page refreshes
- [ ] Can toggle back from completed to active
- [ ] Completion timestamp is recorded
- [ ] Smooth animation for state transition (150ms)
- [ ] Keyboard accessible (Space key when focused)

## Technical Notes
- Create Checkbox component with controlled state
- Update todo completed boolean on toggle
- Update updatedAt timestamp on each toggle
- Use CSS transition for smooth visual change
- Implement optimistic updates for responsiveness
- Add ARIA attributes for checkbox state
- Use semantic checkbox input element

## Dependencies
- Depends on: core-todo-001, core-todo-002
- Blocks: core-todo-006, core-todo-007, core-todo-008

## Tasks
- [ ] Create Checkbox component
- [ ] Implement toggle handler in TodoItem
- [ ] Add completion state to Todo interface
- [ ] Update CSS for completed state styling
- [ ] Add CSS transitions for smooth animation
- [ ] Implement keyboard support (Space key)
- [ ] Write unit tests for toggle functionality
- [ ] Write integration test for completion flow
- [ ] Test keyboard accessibility