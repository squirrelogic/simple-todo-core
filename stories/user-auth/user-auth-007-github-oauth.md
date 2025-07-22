# Story: GitHub OAuth Registration

**ID**: user-auth-007
**Status**: Draft
**Priority**: High
**Points**: 3

## User Story
As a developer user
I want to sign up using my GitHub account
So that I can use my developer identity to access the app

## Acceptance Criteria
- [ ] "Sign up with GitHub" button on registration page
- [ ] Button uses official GitHub branding (Octocat icon)
- [ ] Clicking redirects to GitHub authorization page
- [ ] App requests read-only user data permission
- [ ] GitHub authorization shows app permissions clearly
- [ ] Successful auth redirects back to app
- [ ] Account created with GitHub profile data
- [ ] GitHub username stored for display
- [ ] Profile picture imported from GitHub
- [ ] Email imported (handle private email setting)
- [ ] Immediate login after OAuth success
- [ ] Handle users without public email gracefully

## Technical Notes
- Configure NextAuth.js GitHub Provider
- Register OAuth App in GitHub settings
- Request minimal scope: read:user, user:email
- Handle callback at `/api/auth/callback/github`
- GitHub may not provide email if private
- Implement email request fallback
- Store GitHub ID and username
- Import avatar URL from GitHub
- Handle GitHub API rate limits
- Set emailVerified based on GitHub status
- Link account if email matches existing

## Dependencies
- Depends on: core-todo-001, core-todo-002, user-auth-006 (OAuth patterns)
- Blocks: user-auth-008, user-auth-011 (OAuth sign-in, linking)

## Tasks
- [ ] Create GitHub OAuth App
- [ ] Configure NextAuth GitHub Provider
- [ ] Add GitHub OAuth button with styling
- [ ] Handle GitHub authorization flow
- [ ] Implement email fetching logic
- [ ] Handle private email scenarios
- [ ] Import GitHub profile data
- [ ] Create account or link existing
- [ ] Test with various GitHub account types
- [ ] Handle rate limiting gracefully
- [ ] Write integration tests
- [ ] Document GitHub OAuth setup