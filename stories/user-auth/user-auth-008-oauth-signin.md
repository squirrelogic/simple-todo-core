# Story: OAuth Sign In

**ID**: user-auth-008
**Status**: Draft
**Priority**: High
**Points**: 2

## User Story
As a returning user with an OAuth account
I want to sign in using my Google or GitHub account
So that I can quickly access my todos without entering a password

## Acceptance Criteria
- [ ] OAuth buttons displayed on sign-in page
- [ ] Same styling as registration OAuth buttons
- [ ] Single click initiates OAuth flow
- [ ] Previously authorized accounts skip consent
- [ ] Successful OAuth logs user in immediately
- [ ] Session created with proper expiration
- [ ] Return URL preserved through OAuth flow
- [ ] Unknown OAuth account shows helpful error
- [ ] Option to create account if not found
- [ ] Multiple OAuth providers can be linked
- [ ] Last login provider remembered
- [ ] Loading state during OAuth redirect

## Technical Notes
- Reuse NextAuth OAuth providers from registration
- Check OAuth ID exists in accounts table
- Fast-track authorization for returning users
- Handle unlinked OAuth accounts gracefully
- Preserve returnUrl in state parameter
- Update lastLoginAt timestamp
- Log OAuth sign-in events
- Handle provider errors gracefully
- Support account not found scenario
- Quick redirect to signup if needed

## Dependencies
- Depends on: user-auth-006, user-auth-007 (OAuth setup)
- Blocks: user-auth-015 (need session)

## Tasks
- [ ] Add OAuth buttons to sign-in page
- [ ] Implement OAuth sign-in flow
- [ ] Handle returning user fast-track
- [ ] Add account lookup logic
- [ ] Implement "account not found" UX
- [ ] Preserve and restore return URL
- [ ] Add session creation for OAuth
- [ ] Update last login tracking
- [ ] Create OAuth error handling
- [ ] Write integration tests
- [ ] Test multiple provider scenarios