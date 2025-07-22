# Story: Two-Factor Authentication Login

**ID**: user-auth-010
**Status**: Draft
**Priority**: Medium
**Points**: 3

## User Story
As a user with 2FA enabled
I want to provide my authentication code when signing in
So that my account has an extra layer of security

## Acceptance Criteria
- [ ] After password validation, 2FA prompt appears
- [ ] Clear instructions for entering 6-digit code
- [ ] Code input auto-focuses and formats
- [ ] 30-second validity window for codes
- [ ] "Use backup code" option available
- [ ] Backup code input accepts 8 characters
- [ ] Invalid code shows clear error
- [ ] 5 failed attempts trigger security lockout
- [ ] Success completes login process
- [ ] "Trust this device" option (30 days)
- [ ] Trusted devices skip 2FA
- [ ] Can revoke trusted devices from settings

## Technical Notes
- Check if user has 2FA enabled after password
- Implement TOTP verification with speakeasy
- Allow ±1 time window for clock skew
- Validate backup codes against hashed storage
- Mark used backup codes as consumed
- Track failed 2FA attempts
- Implement device fingerprinting for trust
- Store trusted devices with expiration
- Use secure cookie for device trust
- Log all 2FA attempts (success/fail)
- Send alert email for new device login

## Dependencies
- Depends on: user-auth-009 (2FA must be setup)
- Blocks: None

## Tasks
- [ ] Create 2FA verification page/modal
- [ ] Implement 6-digit code input component
- [ ] Add TOTP verification logic
- [ ] Create backup code verification
- [ ] Track and limit failed attempts
- [ ] Implement device trust feature
- [ ] Store trusted device records
- [ ] Add device management UI
- [ ] Send new device alerts
- [ ] Write unit tests for verification
- [ ] Write integration tests for 2FA flow
- [ ] Test with various authenticators
- [ ] Test backup code scenarios