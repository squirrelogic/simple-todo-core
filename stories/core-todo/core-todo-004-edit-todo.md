# Story: Edit Todo Text

**ID**: core-todo-004
**Status**: Draft
**Priority**: High
**Points**: 3

## User Story
As a user
I want to edit the text of existing todos
So that I can update task details when they change

## Acceptance Criteria
- [ ] Double-click on todo text enters edit mode
- [ ] Current text is shown in editable input field
- [ ] Enter key saves changes and exits edit mode
- [ ] Escape key cancels edit and restores original text
- [ ] Clicking outside the input saves changes
- [ ] Empty text shows confirmation before deletion
- [ ] Character limit of 255 is enforced
- [ ] Focus is set to input when entering edit mode
- [ ] Cursor position is at end of text
- [ ] Other todos remain interactive during edit

## Technical Notes
- Implement edit mode state in TodoItem component
- Use conditional rendering for view/edit modes
- Create EditInput component with auto-focus
- Handle keyboard events (Enter, Escape)
- Implement click-outside detection
- Validate input before saving
- Update updatedAt timestamp on save
- Prevent simultaneous editing of multiple todos

## Dependencies
- Depends on: core-todo-001, core-todo-002
- Blocks: None

## Tasks
- [ ] Add edit mode state to TodoItem
- [ ] Create EditInput component
- [ ] Implement double-click handler
- [ ] Add keyboard event handlers (Enter/Escape)
- [ ] Implement click-outside hook
- [ ] Add validation for empty/long text
- [ ] Create confirmation dialog component
- [ ] Write unit tests for edit functionality
- [ ] Write integration test for edit flow
- [ ] Test keyboard navigation in edit mode