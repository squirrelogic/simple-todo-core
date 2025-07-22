# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern Todo application built with Next.js 15 (App Router), React 19, TypeScript, Zustand for state management, and Tailwind CSS v4 for styling.

## Essential Commands

All commands should be run from the `src` directory:

```bash
cd src
npm run dev          # Start development server
npm run build        # Create production build
npm run lint         # Run ESLint
npm test             # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate test coverage report
```

## Architecture & Code Organization

### Directory Structure
- **src/app/** - Next.js App Router pages and layouts
- **src/components/** - React components organized by feature (e.g., todos/, auth/)
- **src/stores/** - Zustand state stores
- **src/lib/** - Shared utilities and helpers
- **src/types/** - TypeScript type definitions
- **src/contexts/** - React contexts for cross-cutting concerns
- **specs/** - Feature specifications with implementation checklists
- **plans/** - Implementation plans and technical designs

### State Management
Uses Zustand with the following patterns:
- Stores use Immer for immutable updates
- Follow the slice pattern for organizing store logic
- Effects layer for side effects (API calls, persistence)

### Testing Strategy
- Unit tests for utilities and hooks
- Integration tests for components using React Testing Library
- Test files colocated with source files as `*.test.ts(x)`
- Run tests before committing changes

## Key Technical Details

### Import Alias
Use `@/*` for imports from the src directory:
```typescript
import { TodoItem } from '@/types/todo'
```

### TypeScript Configuration
- Strict mode is enabled
- Always define proper types, avoid `any`
- Use interfaces for object shapes, types for unions/primitives

### Styling
- Tailwind CSS v4 with configuration in `tailwind.config.js`
- Mobile-first responsive design
- Follow existing component patterns for consistency

### Component Patterns
- Functional components with TypeScript
- Use custom hooks for reusable logic
- Follow single responsibility principle
- Components should be pure when possible

## Feature Development

When implementing new features:
1. Check `specs/` directory for feature specifications
2. Review the corresponding `.checklist.md` for implementation tracking
3. Follow the existing patterns in similar features
4. Update tests and ensure coverage

## Code Quality

Before completing any task:
1. Run `npm run lint` to check for linting errors
2. Run `npm test` to ensure tests pass
3. Fix any TypeScript errors shown by the IDE
4. Follow the project's ESLint and Prettier configurations

## Environment Variables

Required environment variables are defined in `.env.example`. Key variables:
- `NODE_ENV` - Set to 'development' or 'production'
- `PORT` - Application port (default: 3000)
- Database and auth variables are planned for future features