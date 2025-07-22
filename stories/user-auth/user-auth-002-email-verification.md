# Story: Email Verification Flow

**ID**: user-auth-002
**Status**: Draft
**Priority**: High
**Points**: 3

## User Story
As a newly registered user
I want to verify my email address
So that I can activate my account and start using the application

## Acceptance Criteria
- [ ] Verification email arrives within 1 minute of registration
- [ ] Email contains clear instructions and prominent verify button
- [ ] Verification link includes secure token in URL
- [ ] Clicking link opens verification page in app
- [ ] Success message displayed after verification
- [ ] User automatically signed in after verification
- [ ] Account status updated to verified in database
- [ ] Expired link (>24 hours) shows appropriate error
- [ ] Already verified link shows informative message
- [ ] Resend verification email option available
- [ ] Rate limit resend requests (1 per minute, 5 per hour)
- [ ] Unverified users cannot access todo features

## Technical Notes
- Use NextAuth.js verification token system
- Store tokens in verification_tokens table
- Token format: secure random 32 bytes, URL-safe encoding
- Token expiry: 24 hours from generation
- Verification page at `/auth/verify?token={token}`
- Update user.emailVerified field upon verification
- Auto-login using NextAuth signIn after verification
- Clear verification token after successful use
- Implement middleware to check email verification status
- Log verification events for security audit

## Dependencies
- Depends on: user-auth-001 (registration must be complete)
- Blocks: user-auth-003, user-auth-007 (must verify email first)

## Tasks
- [ ] Create email verification template with branding
- [ ] Implement verification page component
- [ ] Create token validation endpoint
- [ ] Add email verification check middleware
- [ ] Implement resend verification email endpoint
- [ ] Add rate limiting to resend functionality
- [ ] Create success/error UI states
- [ ] Set up automatic sign-in after verification
- [ ] Write unit tests for token validation
- [ ] Write integration tests for verification flow
- [ ] Test email delivery and formatting
- [ ] Add monitoring for email delivery success