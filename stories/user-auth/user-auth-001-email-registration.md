# Story: Email/Password Registration

**ID**: user-auth-001
**Status**: Draft
**Priority**: High
**Points**: 5

## User Story
As a new user
I want to create an account with my email and password
So that I can securely save and access my todos across devices

## Acceptance Criteria
- [ ] Registration form displays email, password, and confirm password fields
- [ ] Email validation shows real-time feedback (valid format, not already registered)
- [ ] Password field shows/hide toggle for visibility
- [ ] Password strength indicator updates as user types (weak/fair/strong)
- [ ] Password requirements clearly displayed (8+ chars, uppercase, lowercase, number, special)
- [ ] Confirm password field validates match with password field
- [ ] Terms and Privacy checkbox required before submission
- [ ] Submit button disabled until all fields valid
- [ ] Loading state displayed during registration
- [ ] Verification email sent upon successful registration
- [ ] Success message shows with instructions to check email
- [ ] Error messages are clear and actionable

## Technical Notes
- Use NextAuth.js Email Provider for registration flow
- Implement custom registration endpoint `/api/auth/signup`
- Hash passwords with bcrypt (12 rounds minimum)
- Generate secure verification token with crypto.randomBytes
- Store user in PostgreSQL with Prisma ORM
- Email validation: RFC 5322 regex + database uniqueness check
- Password strength calculation based on entropy
- Rate limit registration endpoint (5 attempts per IP per hour)
- Implement CAPTCHA for bot prevention (after 2 failed attempts)
- Send verification email via SendGrid within 1 minute

## Dependencies
- Depends on: core-todo-001, core-todo-002, core-todo-009 (must have basic todo functionality)
- Blocks: user-auth-003, user-auth-004, user-auth-005, user-auth-006

## Tasks
- [ ] Create registration page component with form
- [ ] Implement email validation (format and uniqueness)
- [ ] Create password strength calculator utility
- [ ] Add real-time form validation with error messages
- [ ] Create `/api/auth/signup` endpoint with rate limiting
- [ ] Implement bcrypt password hashing
- [ ] Set up Prisma schema for users table
- [ ] Configure SendGrid for email delivery
- [ ] Create email verification token generation
- [ ] Design and implement verification email template
- [ ] Write unit tests for validation and hashing
- [ ] Write integration tests for registration flow
- [ ] Add E2E tests for complete user journey
- [ ] Document registration API endpoint