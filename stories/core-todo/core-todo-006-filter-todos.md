# Story: Filter Todos by Status

**ID**: core-todo-006
**Status**: Draft
**Priority**: High
**Points**: 3

## User Story
As a user
I want to filter todos by their completion status
So that I can focus on active tasks or review completed ones

## Acceptance Criteria
- [ ] Three filter buttons displayed: "All", "Active", "Completed"
- [ ] Current filter is visually highlighted
- [ ] Clicking filter immediately updates the displayed list
- [ ] URL updates to reflect current filter (e.g., #/active)
- [ ] Filter state persists across page refreshes
- [ ] Item count updates based on current filter
- [ ] Keyboard navigation between filters (Tab/Arrow keys)
- [ ] Empty state messages specific to each filter
- [ ] Smooth transition when switching filters

## Technical Notes
- Create TodoFilter component with three buttons
- Use URL hash routing for filter state
- Implement filter logic in todo list rendering
- Update localStorage with filter preference
- Use React Router or native hashchange event
- Add active filter styling with Tailwind
- Implement keyboard navigation logic
- Use ARIA attributes for filter state

## Dependencies
- Depends on: core-todo-002, core-todo-003
- Blocks: core-todo-015

## Tasks
- [ ] Create TodoFilter component
- [ ] Implement filter button styling
- [ ] Add URL hash routing logic
- [ ] Update TodoList to respect filters
- [ ] Implement filter persistence
- [ ] Add keyboard navigation support
- [ ] Create filter-specific empty states
- [ ] Write unit tests for filter logic
- [ ] Write integration test for filter flow
- [ ] Test URL persistence across refreshes