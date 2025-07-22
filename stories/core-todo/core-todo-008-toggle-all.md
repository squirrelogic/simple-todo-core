# Story: Toggle All Todos

**ID**: core-todo-008
**Status**: Draft
**Priority**: Medium
**Points**: 2

## User Story
As a user
I want to mark all todos as complete or incomplete at once
So that I can quickly manage the status of my entire list

## Acceptance Criteria
- [ ] "Toggle all" checkbox appears above the todo list
- [ ] Checkbox is checked when all todos are completed
- [ ] Checkbox is unchecked when any todo is active
- [ ] Clicking toggles all todos to opposite state
- [ ] Visual feedback shows bulk state change
- [ ] Operation affects only visible todos (current filter)
- [ ] Smooth animation for all status changes
- [ ] Keyboard accessible (Space when focused)
- [ ] Screen reader announces bulk operation

## Technical Notes
- Create ToggleAll component with checkbox
- Calculate checked state from todo statuses
- Implement toggleAll handler in state
- Batch update all todo completed states
- Update all updatedAt timestamps
- Consider performance for large lists
- Add loading state for bulk operation
- Use semantic checkbox with label

## Dependencies
- Depends on: core-todo-003
- Blocks: None

## Tasks
- [ ] Create ToggleAll component
- [ ] Calculate aggregate completion state
- [ ] Implement toggleAll handler
- [ ] Add visual feedback during operation
- [ ] Optimize for large list performance
- [ ] Add keyboard support
- [ ] Style checkbox and label
- [ ] Write unit tests for toggle logic
- [ ] Write integration test for bulk toggle
- [ ] Test performance with 1000+ todos