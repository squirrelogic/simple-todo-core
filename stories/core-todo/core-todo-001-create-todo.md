# Story: Create Todo Item

**ID**: core-todo-001
**Status**: Draft
**Priority**: High
**Points**: 3

## User Story
As a user
I want to create new todo items
So that I can track tasks I need to complete

## Acceptance Criteria
- [ ] Input field is prominently displayed at the top of the page
- [ ] Can create todo by typing text and pressing Enter
- [ ] Can create todo by clicking an "Add" button
- [ ] Empty todos (whitespace only) are not created
- [ ] Input is trimmed of leading/trailing whitespace
- [ ] Input is cleared after successful todo creation
- [ ] New todos appear immediately at the top of the list
- [ ] Input field maintains focus after creating a todo
- [ ] Character limit of 255 is enforced with visual feedback
- [ ] Input field has placeholder text "What needs to be done?"

## Technical Notes
- Use controlled input component with local React state
- Call Zustand store's addTodo action on submission
- Generate UUID v4 for todo IDs in the store action
- Add creation timestamp (ISO 8601 format) in the store
- Zustand handles state updates automatically
- Implement character counter when approaching limit
- Use form element for semantic HTML
- Add ARIA labels for accessibility
- Store action should trim whitespace and validate

## Dependencies
- Depends on: None (foundational story)
- Blocks: core-todo-002, core-todo-003, core-todo-004, core-todo-005

## Tasks
- [ ] Create TodoInput component with controlled input
- [ ] Implement form submission handler
- [ ] Add input validation (empty check, trimming)
- [ ] Generate unique IDs using crypto.randomUUID()
- [ ] Create Todo TypeScript interface
- [ ] Add character limit validation and counter
- [ ] Write unit tests for input component
- [ ] Write unit tests for validation logic
- [ ] Add integration test for todo creation flow
- [ ] Update component documentation