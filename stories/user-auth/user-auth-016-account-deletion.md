# Story: Account Deletion

**ID**: user-auth-016
**Status**: Draft
**Priority**: Low
**Points**: 3

## User Story
As a user
I want to delete my account and all associated data
So that I can completely remove my information from the service

## Acceptance Criteria
- [ ] Delete account option in danger zone of settings
- [ ] Clear warning about permanent data loss
- [ ] List of data to be deleted shown
- [ ] Require password confirmation
- [ ] Require typing "DELETE" confirmation
- [ ] 30-day grace period explanation
- [ ] Immediate soft delete execution
- [ ] All sessions terminated immediately
- [ ] Confirmation email sent
- [ ] Recovery link in email (30 days)
- [ ] Account inaccessible after deletion
- [ ] Hard delete after grace period

## Technical Notes
- Implement soft delete with deletedAt timestamp
- Keep data for 30-day recovery period
- Deactivate all sessions immediately
- Cancel any active subscriptions (future)
- Queue hard delete job for 30 days
- Anonymize data after hard delete
- Export user data before soft delete
- Log deletion request with reason
- Send GDPR-compliant confirmation
- Block sign-in for deleted accounts
- Allow recovery within grace period

## Dependencies
- Depends on: user-auth-003 (must be signed in)
- Blocks: None

## Tasks
- [ ] Create account deletion UI
- [ ] Design confirmation flow
- [ ] Implement password verification
- [ ] Add DELETE text confirmation
- [ ] Create soft delete API
- [ ] Update user model for soft delete
- [ ] Implement session termination
- [ ] Create deletion email template
- [ ] Add recovery link generation
- [ ] Queue hard delete job
- [ ] Implement recovery flow
- [ ] Write unit tests for deletion
- [ ] Test grace period behavior
- [ ] Verify data anonymization