# Story: Browser Push Notification Setup

**ID**: notifications-001
**Status**: Draft
**Priority**: High
**Points**: 3

## User Story
As a user
I want to enable browser push notifications
So that I can receive timely reminders without having the app open

## Acceptance Criteria
- [ ] Permission request appears contextually (not on page load)
- [ ] Clear value proposition shown before permission request
- [ ] Browser notifications work across Chrome, Firefox, Safari, Edge
- [ ] Service worker registration successful
- [ ] Notifications appear even when browser tab is closed
- [ ] Fallback to in-app notifications if permission denied
- [ ] Permission status clearly displayed in settings

## Technical Notes
- Implement service worker with Workbox
- Use Web Push API for background notifications
- Store permission status in user preferences
- Handle browser compatibility differences
- Implement VAPID key generation and management
- Consider PWA installation prompt

## Dependencies
- Depends on: Core todo functionality, Due dates feature
- Blocks: NOT-007 (Smart bundling), NOT-010 (Priority notifications)

## Tasks
- [ ] Set up service worker infrastructure
- [ ] Implement Web Push API integration
- [ ] Create permission request UI flow
- [ ] Handle browser compatibility
- [ ] Add notification payload encryption
- [ ] Test across all major browsers
- [ ] Create fallback mechanisms
- [ ] Document setup process