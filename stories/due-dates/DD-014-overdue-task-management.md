# Story: Overdue Task Management

**ID**: due-dates-014
**Status**: Draft
**Priority**: Medium
**Points**: 3

## User Story
As a user
I want special handling for overdue tasks
So that I can address missed deadlines effectively

## Acceptance Criteria
- [ ] Overdue section in todo list (collapsible)
- [ ] Bulk reschedule overdue tasks
- [ ] Snooze options (1 day, 1 week, custom)
- [ ] Overdue task count in app badge
- [ ] Quick reschedule to today/tomorrow
- [ ] Option to complete as late

## Technical Notes
- Efficient overdue detection algorithm
- Consider separate overdue view
- Implement snooze functionality
- Update app badge/title with count
- Consider notification for newly overdue

## Dependencies
- Depends on: DD-001 (Due dates), DD-004 (Visual indicators)
- Blocks: None

## Tasks
- [ ] Create overdue detection service
- [ ] Add overdue section to UI
- [ ] Implement bulk reschedule
- [ ] Create snooze dialog
- [ ] Add quick action buttons
- [ ] Update app badge logic
- [ ] Add overdue filters
- [ ] Create overdue notifications
- [ ] Test performance impact
- [ ] Write unit tests
- [ ] Add e2e tests
- [ ] Document overdue handling