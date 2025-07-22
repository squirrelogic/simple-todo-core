# Story: Google OAuth Registration

**ID**: user-auth-006
**Status**: Draft
**Priority**: High
**Points**: 3

## User Story
As a new user
I want to sign up using my Google account
So that I can quickly create an account without managing another password

## Acceptance Criteria
- [ ] "Sign up with Google" button on registration page
- [ ] Button uses official Google branding/colors
- [ ] Clicking redirects to Google OAuth consent screen
- [ ] User can select Google account to use
- [ ] App requests only necessary permissions (email, profile)
- [ ] Successful auth redirects back to app
- [ ] Account created with Google profile data
- [ ] No email verification required for OAuth
- [ ] Profile picture imported from Google
- [ ] User immediately logged in after OAuth
- [ ] Existing email handled gracefully (link accounts)
- [ ] OAuth cancellation returns to signup page

## Technical Notes
- Configure NextAuth.js Google Provider
- Set up OAuth 2.0 credentials in Google Console
- Use PKCE flow for enhanced security
- Request minimal scopes: email, profile
- Handle OAuth callback at `/api/auth/callback/google`
- Extract user data: email, name, picture
- Check if email already exists in database
- Create or link account based on email
- Store Google ID for future logins
- Set emailVerified to true automatically
- Create session after successful OAuth

## Dependencies
- Depends on: core-todo-001, core-todo-002 (basic todo functionality)
- Blocks: user-auth-008, user-auth-011 (OAuth sign-in, linking)

## Tasks
- [ ] Set up Google OAuth app in Google Console
- [ ] Configure NextAuth Google Provider
- [ ] Add Google OAuth button to UI
- [ ] Implement proper button styling/branding
- [ ] Handle OAuth callback processing
- [ ] Create account linking logic
- [ ] Import profile data from Google
- [ ] Set up proper OAuth error handling
- [ ] Test consent screen flow
- [ ] Implement cancellation handling
- [ ] Write integration tests for OAuth flow
- [ ] Test account linking scenarios
- [ ] Document OAuth setup process