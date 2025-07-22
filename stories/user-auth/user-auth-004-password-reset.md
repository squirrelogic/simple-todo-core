# Story: Password Reset Request

**ID**: user-auth-004
**Status**: Draft
**Priority**: High
**Points**: 3

## User Story
As a user who forgot my password
I want to reset my password via email
So that I can regain access to my account

## Acceptance Criteria
- [ ] "Forgot password?" link on sign-in page
- [ ] Reset form accepts email address
- [ ] Success message shown regardless of email existence (security)
- [ ] Reset email sent within 1 minute for valid accounts
- [ ] Email contains clear instructions and reset button
- [ ] Reset link includes secure token
- [ ] Link expires after 1 hour
- [ ] Rate limiting prevents abuse (3 requests per hour)
- [ ] Previous reset links invalidated on new request
- [ ] Reset events logged for security audit
- [ ] Email template matches app branding
- [ ] Support link included for further help

## Technical Notes
- Create password reset request endpoint
- Generate cryptographically secure reset token
- Store token hash in database (not plain text)
- Include token and email in reset URL
- Always return success to prevent email enumeration
- Send email via SendGrid transactional API
- Implement exponential backoff for failed sends
- Clear old tokens before creating new ones
- Log all reset attempts with IP address
- Monitor for suspicious reset patterns

## Dependencies
- Depends on: user-auth-001 (must have account)
- Blocks: user-auth-005 (need reset token)

## Tasks
- [ ] Create forgot password page and form
- [ ] Implement reset request endpoint
- [ ] Add secure token generation (crypto.randomBytes)
- [ ] Create password_reset_tokens table
- [ ] Design password reset email template
- [ ] Configure SendGrid for reset emails
- [ ] Implement rate limiting for requests
- [ ] Add token expiration logic (1 hour)
- [ ] Create security logging for resets
- [ ] Write unit tests for token generation
- [ ] Write integration tests for request flow
- [ ] Test email delivery and formatting
- [ ] Add monitoring for delivery failures