# Story: User Data Export

**ID**: user-auth-017
**Status**: Draft
**Priority**: Low
**Points**: 2

## User Story
As a user
I want to export all my data
So that I can backup my information or comply with data portability rights

## Acceptance Criteria
- [ ] Export option in account settings
- [ ] Clear description of included data
- [ ] One-click export generation
- [ ] Progress indicator for large exports
- [ ] Email notification when ready
- [ ] Secure download link (expires 48 hours)
- [ ] JSON format for todos
- [ ] CSV option for todos
- [ ] Includes profile information
- [ ] Includes account metadata
- [ ] Zip file for multiple formats
- [ ] GDPR-compliant format

## Technical Notes
- Create data export API endpoint
- Gather all user-related data
- Format todos as JSON and CSV
- Include all profile fields
- Add account metadata (dates, settings)
- Generate secure download token
- Store export temporarily (48 hours)
- Use background job for large exports
- Send email with download link
- Log export requests for compliance
- Auto-cleanup expired exports

## Dependencies
- Depends on: user-auth-003 (must be signed in)
- Blocks: None

## Tasks
- [ ] Create export request UI
- [ ] Design export format structure
- [ ] Implement data gathering logic
- [ ] Create JSON formatter
- [ ] Create CSV formatter
- [ ] Generate zip archives
- [ ] Implement secure downloads
- [ ] Add email notifications
- [ ] Create cleanup job
- [ ] Write unit tests for formats
- [ ] Test large data exports
- [ ] Verify GDPR compliance