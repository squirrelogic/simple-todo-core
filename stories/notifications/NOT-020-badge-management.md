# Story: App Badge Management

**ID**: notifications-020
**Status**: Draft
**Priority**: Low
**Points**: 2

## User Story
As a mobile user
I want to see unread count on the app icon
So that I know when I have pending notifications

## Acceptance Criteria
- [ ] App icon badge shows unread notification count
- [ ] Badge updates when notifications are read/dismissed
- [ ] Badge clears when app is opened
- [ ] Different badge behavior iOS vs Android
- [ ] Badge count syncs across devices
- [ ] Option to disable badge counts
- [ ] Badge shows total or category-specific count
- [ ] Handle badge count limits (999+)

## Technical Notes
- Use native APIs for badge updates
- Sync badge count with server
- Handle app lifecycle events
- Consider PWA badge API
- Implement badge count strategies
- Test on various OS versions

## Dependencies
- Depends on: NOT-004 (Mobile push)
- Blocks: None

## Tasks
- [ ] Implement iOS badge API
- [ ] Implement Android badge API
- [ ] Create badge sync service
- [ ] Handle count calculations
- [ ] Add badge preferences
- [ ] Test across platforms
- [ ] Handle edge cases
- [ ] Document platform differences