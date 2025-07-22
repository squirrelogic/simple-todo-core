# Story: Natural Language Date Input

**ID**: due-dates-015
**Status**: Draft
**Priority**: Medium
**Points**: 3

## User Story
As a user
I want to type due dates in natural language
So that I can quickly set dates without using a picker

## Acceptance Criteria
- [ ] Accept phrases like "tomorrow", "next friday", "in 3 days"
- [ ] Show parsed date preview before confirming
- [ ] Support common date formats (MM/DD, DD/MM)
- [ ] Highlight recognized date parts
- [ ] Fallback to picker if parsing fails
- [ ] Support multiple languages

## Technical Notes
- Use chrono-node for parsing
- Implement real-time parsing feedback
- Consider locale-specific formats
- Cache parsed results
- Handle ambiguous inputs gracefully

## Dependencies
- Depends on: DD-001 (Basic due date)
- Blocks: DD-012 (Keyboard shortcuts)

## Tasks
- [ ] Integrate chrono-node library
- [ ] Create natural language input field
- [ ] Implement parsing feedback UI
- [ ] Add date preview display
- [ ] Handle parsing errors
- [ ] Support locale formats
- [ ] Add parsing hints
- [ ] Test common phrases
- [ ] Test edge cases
- [ ] Add internationalization
- [ ] Write parsing tests
- [ ] Document supported formats