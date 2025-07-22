# Story: Due Date Notifications

**ID**: due-dates-007
**Status**: Draft
**Priority**: Medium
**Points**: 5

## User Story
As a user
I want to receive notifications for upcoming due dates
So that I don't miss important tasks

## Acceptance Criteria
- [ ] Browser notifications for tasks due today (9 AM reminder)
- [ ] Notification 1 hour before due time (if time is set)
- [ ] Can enable/disable notifications in settings
- [ ] Click notification to open specific todo
- [ ] Request permission gracefully
- [ ] Fallback to in-app notifications if permission denied

## Technical Notes
- Use Notification API with permission handling
- Implement service worker for background notifications
- Create notification scheduling service
- Handle browser compatibility
- Store notification preferences
- Consider notification queuing

## Dependencies
- Depends on: DD-001 (Due dates), Settings infrastructure
- Blocks: None

## Tasks
- [ ] Create NotificationService class
- [ ] Implement permission request flow
- [ ] Set up service worker
- [ ] Create notification scheduler
- [ ] Add notification preferences UI
- [ ] Implement notification click handling
- [ ] Add in-app notification fallback
- [ ] Handle notification queue
- [ ] Test across browsers
- [ ] Test permission states
- [ ] Add e2e tests for notifications
- [ ] Document notification setup