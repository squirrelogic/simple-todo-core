# Story: User Profile Display

**ID**: user-auth-013
**Status**: Draft
**Priority**: Medium
**Points**: 2

## User Story
As a signed-in user
I want to view my profile information
So that I can see my account details and settings

## Acceptance Criteria
- [ ] Profile page accessible from user menu
- [ ] Display user's name (or email if no name)
- [ ] Show profile picture/avatar
- [ ] Display email address with verified badge
- [ ] Show account creation date
- [ ] Display last login time
- [ ] List connected OAuth providers
- [ ] Show 2FA status (enabled/disabled)
- [ ] Display todo statistics (total, completed)
- [ ] Edit button for each editable field
- [ ] Settings link to security options
- [ ] Responsive layout for mobile

## Technical Notes
- Create profile page at /profile route
- Fetch user data with getServerSession
- Load user stats from database
- Display OAuth providers from accounts table
- Format dates using user's timezone
- Show gravatar if no custom avatar
- Calculate todo completion percentage
- Use skeleton loading for data fetch
- Implement proper error boundaries
- Cache profile data appropriately

## Dependencies
- Depends on: user-auth-003 (must be signed in)
- Blocks: user-auth-014, user-auth-015 (view before edit)

## Tasks
- [ ] Create profile page component
- [ ] Design profile information layout
- [ ] Fetch user data from session
- [ ] Load todo statistics
- [ ] Display OAuth connections
- [ ] Add date formatting
- [ ] Implement avatar display
- [ ] Create verified badge component
- [ ] Add navigation from user menu
- [ ] Write unit tests for display
- [ ] Test responsive design
- [ ] Add loading states