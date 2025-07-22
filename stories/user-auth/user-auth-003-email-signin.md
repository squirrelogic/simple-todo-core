# Story: Email/Password Sign In

**ID**: user-auth-003
**Status**: Draft
**Priority**: High
**Points**: 3

## User Story
As a registered user
I want to sign in with my email and password
So that I can access my todos from any device

## Acceptance Criteria
- [ ] Sign-in form displays email and password fields
- [ ] "Remember me" checkbox available (30-day persistence)
- [ ] Password field has show/hide toggle
- [ ] Form validates on submit (not on blur for better UX)
- [ ] Loading state shown during authentication
- [ ] Clear error message for invalid credentials
- [ ] Account locked message after 10 failed attempts
- [ ] "Forgot password?" link prominently displayed
- [ ] Successful login redirects to todos page
- [ ] Return URL preserved through login flow
- [ ] Rate limiting prevents brute force (5 attempts per 15 min)
- [ ] Session created with secure httpOnly cookie

## Technical Notes
- Use NextAuth.js credentials provider
- Validate email format before submission
- Compare password hash using bcrypt.compare()
- Track failed attempts in database
- Implement account lockout (10 failures = 1 hour lock)
- Rate limit by IP and email independently
- Create JWT session token with 15-minute expiry
- Create refresh token with 7-day expiry
- Set secure cookie flags (httpOnly, secure, sameSite)
- Log authentication events (success/failure)
- Clear sensitive data from memory after use

## Dependencies
- Depends on: user-auth-001, user-auth-002 (must have verified account)
- Blocks: user-auth-015, user-auth-016 (need active session)

## Tasks
- [ ] Create sign-in page with form component
- [ ] Configure NextAuth credentials provider
- [ ] Implement form validation and error handling
- [ ] Add password visibility toggle
- [ ] Create authentication rate limiter
- [ ] Implement failed attempt tracking
- [ ] Add account lockout logic
- [ ] Set up session token generation
- [ ] Configure secure cookie settings
- [ ] Add remember me functionality
- [ ] Implement return URL handling
- [ ] Write unit tests for auth logic
- [ ] Write integration tests for sign-in flow
- [ ] Test rate limiting and lockout
- [ ] Add authentication event logging