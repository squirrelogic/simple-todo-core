# Story: Profile Information Editing

**ID**: user-auth-014
**Status**: Draft
**Priority**: Medium
**Points**: 3

## User Story
As a user
I want to edit my profile information
So that I can keep my account details up to date

## Acceptance Criteria
- [ ] Inline editing for name field
- [ ] Avatar upload with image preview
- [ ] Support common image formats (JPG, PNG)
- [ ] Image size limit enforced (5MB)
- [ ] Image automatically resized/optimized
- [ ] Save button appears when changes made
- [ ] Loading state during save
- [ ] Success message after save
- [ ] Validation for name (2-50 characters)
- [ ] Cancel option reverts changes
- [ ] Email change requires re-verification
- [ ] Timezone selection dropdown

## Technical Notes
- Implement inline edit components
- Use Cloudinary/S3 for avatar storage
- Resize images to 200x200 max
- Optimize images (WebP format)
- Update user record via API
- Validate all inputs server-side
- Handle file upload errors gracefully
- Email change creates new verification
- Log profile update events
- Update session after changes
- Clear CDN cache for avatars

## Dependencies
- Depends on: user-auth-013 (must view first)
- Blocks: None

## Tasks
- [ ] Create inline edit components
- [ ] Implement avatar upload UI
- [ ] Set up image storage service
- [ ] Add image processing pipeline
- [ ] Create profile update API
- [ ] Add client-side validation
- [ ] Implement optimistic updates
- [ ] Handle email change flow
- [ ] Add timezone selector
- [ ] Write unit tests for validation
- [ ] Test image upload scenarios
- [ ] Test error handling
- [ ] Verify session updates