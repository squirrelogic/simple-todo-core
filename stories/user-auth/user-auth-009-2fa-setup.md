# Story: Two-Factor Authentication Setup

**ID**: user-auth-009
**Status**: Draft
**Priority**: Medium
**Points**: 5

## User Story
As a security-conscious user
I want to enable two-factor authentication on my account
So that my todos are protected even if my password is compromised

## Acceptance Criteria
- [ ] 2FA setup option in account security settings
- [ ] Clear explanation of 2FA benefits and process
- [ ] QR code generated for authenticator apps
- [ ] Manual entry code displayed as alternative
- [ ] List of compatible authenticator apps shown
- [ ] Test verification required before enabling
- [ ] 10 backup codes generated and displayed
- [ ] Backup codes downloadable as text file
- [ ] Warning about saving backup codes
- [ ] Success confirmation after setup
- [ ] 2FA status shown in security settings
- [ ] Option to disable 2FA with password confirmation

## Technical Notes
- Use speakeasy library for TOTP implementation
- Generate unique secret per user (32 bytes)
- Create QR code with qrcode library
- Format: otpauth://totp/SimpleTodo:email?secret=XXX
- Store encrypted secret in database
- Generate 10 backup codes (8 chars each)
- Hash backup codes before storage
- Require current password for 2FA changes
- Test code must be valid to enable
- Log all 2FA setup/change events
- Send email notification of 2FA changes

## Dependencies
- Depends on: user-auth-003 (must be logged in)
- Blocks: user-auth-010 (need 2FA setup first)

## Tasks
- [ ] Create 2FA setup page in settings
- [ ] Install and configure speakeasy
- [ ] Implement secret generation
- [ ] Create QR code generator
- [ ] Build authenticator app list UI
- [ ] Implement verification test flow
- [ ] Generate and store backup codes
- [ ] Create backup code download
- [ ] Add password confirmation modal
- [ ] Update user model for 2FA fields
- [ ] Send 2FA change notifications
- [ ] Write unit tests for TOTP
- [ ] Write integration tests for setup
- [ ] Test with multiple authenticator apps
- [ ] Document 2FA setup process