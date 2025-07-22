# Story: Visual Due Date Indicators

**ID**: due-dates-004
**Status**: Draft
**Priority**: High
**Points**: 3

## User Story
As a user
I want to see visual indicators for due dates on todo items
So that I can quickly identify urgent tasks

## Acceptance Criteria
- [ ] Due date displayed on todo item in list view
- [ ] Color coding: Red (overdue), Orange (due today), Yellow (due tomorrow), Green (future)
- [ ] Due date format is relative (e.g., "Due in 2 days", "Overdue by 3 days")
- [ ] Tooltip shows exact date on hover
- [ ] Icon indicator for items with due dates
- [ ] Accessible text alternatives for color coding

## Technical Notes
- Use date-fns formatRelative and differenceInDays
- Implement DueDateBadge component
- Consider performance with many todos (memoization)
- CSS classes for urgency levels
- Ensure color contrast meets WCAG standards

## Dependencies
- Depends on: DD-001 (Basic due date functionality)
- Blocks: DD-005 (Sorting), DD-018 (Overdue management)

## Tasks
- [ ] Create DueDateBadge component
- [ ] Implement relative date formatting logic
- [ ] Add urgency level calculation
- [ ] Apply color coding styles
- [ ] Add calendar icon
- [ ] Implement tooltip functionality
- [ ] Add aria-labels for accessibility
- [ ] Create unit tests for date formatting
- [ ] Performance testing with large lists
- [ ] Cross-browser visual testing