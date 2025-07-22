# Story: Password Reset Completion

**ID**: user-auth-005
**Status**: Draft
**Priority**: High
**Points**: 2

## User Story
As a user with a reset token
I want to set a new password
So that I can access my account again

## Acceptance Criteria
- [ ] Reset page validates token before showing form
- [ ] Invalid/expired token shows clear error message
- [ ] Form displays new password and confirm password fields
- [ ] Password requirements clearly shown
- [ ] Real-time password strength indicator
- [ ] Passwords must match validation
- [ ] Cannot reuse last 5 passwords
- [ ] Success message after password change
- [ ] All sessions invalidated after reset
- [ ] User automatically signed in after reset
- [ ] Confirmation email sent about password change
- [ ] Reset token deleted after use

## Technical Notes
- Validate token and email from URL parameters
- Check token expiration (1 hour limit)
- Verify token hasn't been used already
- Hash new password with bcrypt (12 rounds)
- Store password history for reuse check
- Invalidate all existing sessions
- Delete all refresh tokens
- Send security notification email
- Auto-login user after successful reset
- Log password change event
- Clear reset token from database

## Dependencies
- Depends on: user-auth-004 (need reset token)
- Blocks: None

## Tasks
- [ ] Create password reset completion page
- [ ] Implement token validation endpoint
- [ ] Add password history tracking
- [ ] Create password reuse validator
- [ ] Implement session invalidation logic
- [ ] Design security notification email
- [ ] Add automatic sign-in after reset
- [ ] Configure password strength requirements
- [ ] Write unit tests for validation
- [ ] Write integration tests for reset flow
- [ ] Test session cleanup
- [ ] Verify security email delivery