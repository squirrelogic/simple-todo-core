# Story: Keyboard Navigation Support

**ID**: core-todo-010
**Status**: Draft
**Priority**: High
**Points**: 3

## User Story
As a keyboard user
I want to navigate and interact with todos using only the keyboard
So that I can use the app efficiently without a mouse

## Acceptance Criteria
- [ ] Tab key navigates through all interactive elements
- [ ] Enter creates todo when input is focused
- [ ] Space toggles completion when todo is focused
- [ ] Enter enters edit mode when todo is focused
- [ ] Escape cancels edit mode
- [ ] Delete key deletes todo with confirmation
- [ ] Arrow keys navigate between filter buttons
- [ ] Focus indicators are clearly visible
- [ ] Tab order is logical and predictable
- [ ] Shortcuts work from any focus state

## Technical Notes
- Implement focus management system
- Use tabindex appropriately (0 or -1)
- Create keyboard event handlers
- Add visible focus styles with Tailwind
- Use focus-visible for mouse vs keyboard
- Implement roving tabindex for todo list
- Create useKeyboard custom hook
- Ensure focus trap in dialogs
- Test with keyboard-only navigation

## Dependencies
- Depends on: core-todo-001, core-todo-002, core-todo-003, core-todo-004, core-todo-005
- Blocks: core-todo-017

## Tasks
- [ ] Create useKeyboard hook
- [ ] Add keyboard event handlers to components
- [ ] Implement focus management logic
- [ ] Style focus indicators (ring)
- [ ] Add roving tabindex to todo list
- [ ] Implement dialog focus trap
- [ ] Create keyboard navigation guide
- [ ] Write unit tests for keyboard handlers
- [ ] Write integration test for navigation flow
- [ ] Manual testing with keyboard only