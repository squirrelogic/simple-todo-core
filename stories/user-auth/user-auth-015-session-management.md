# Story: Active Session Management

**ID**: user-auth-015
**Status**: Draft
**Priority**: Medium
**Points**: 3

## User Story
As a user
I want to see and manage my active sessions
So that I can control where my account is accessed from

## Acceptance Criteria
- [ ] Sessions list in security settings
- [ ] Current session clearly marked
- [ ] Device type icon (desktop/mobile/tablet)
- [ ] Browser name and version shown
- [ ] IP address location (city, country)
- [ ] Last activity timestamp
- [ ] "Sign out" button for other sessions
- [ ] "Sign out all other sessions" option
- [ ] Confirmation before signing out sessions
- [ ] Success message after session revoked
- [ ] Real-time update when session ends
- [ ] Suspicious activity indicators

## Technical Notes
- Store session metadata in database
- Parse user agent for device/browser
- Use IP geolocation service
- Track last activity per session
- Implement session revocation API
- Invalidate JWT for revoked sessions
- Use WebSocket for real-time updates
- Flag suspicious patterns (new country)
- Limit to showing last 10 sessions
- Auto-cleanup old session records
- Send email for session revocation

## Dependencies
- Depends on: user-auth-003, user-auth-008 (active sessions)
- Blocks: None

## Tasks
- [ ] Create sessions list component
- [ ] Design session item display
- [ ] Implement user agent parsing
- [ ] Add IP geolocation service
- [ ] Create session revocation API
- [ ] Add confirmation dialogs
- [ ] Implement real-time updates
- [ ] Add suspicious activity detection
- [ ] Create session cleanup job
- [ ] Send security notifications
- [ ] Write unit tests for parsing
- [ ] Test revocation scenarios
- [ ] Test real-time updates