# Story: Display Todo List

**ID**: core-todo-002
**Status**: Draft
**Priority**: High
**Points**: 2

## User Story
As a user
I want to see all my todo items in a list
So that I can review what needs to be done

## Acceptance Criteria
- [ ] All todos are displayed in a vertical list
- [ ] List is scrollable when content exceeds viewport
- [ ] Each todo shows its text clearly
- [ ] Completed todos are visually distinct (strikethrough + gray text)
- [ ] List updates in real-time as todos are added/modified/deleted
- [ ] Todos are displayed in reverse chronological order (newest first)
- [ ] Empty state message when no todos exist
- [ ] List maintains scroll position during updates
- [ ] Each todo item has consistent spacing and alignment

## Technical Notes
- Create TodoList container component
- Create TodoItem component for individual todos
- Use React key prop with todo IDs for efficient updates
- Implement CSS for completed todo styling
- Consider virtualization for lists > 100 items (future)
- Use semantic HTML (ul/li elements)
- Add ARIA live region for list updates

## Dependencies
- Depends on: core-todo-001
- Blocks: core-todo-003, core-todo-004, core-todo-005, core-todo-006

## Tasks
- [ ] Create TodoList component
- [ ] Create TodoItem component
- [ ] Implement todo rendering logic
- [ ] Add CSS for todo states (active/completed)
- [ ] Create EmptyState component
- [ ] Add smooth transitions for list updates
- [ ] Write unit tests for components
- [ ] Write integration test for list rendering
- [ ] Test with various list sizes