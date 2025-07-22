# Simple Todo

A modern, feature-rich todo application built with Next.js, designed to help users manage their tasks efficiently with advanced features like due dates, notifications, and user authentication.

## About This Project

This project is a demonstration of using [Claude Core Commands](https://github.com/squirrelogic/core-commands) - a set of custom commands designed to streamline the development workflow with Claude AI. The entire application was built using these commands to showcase their effectiveness in real-world project development.

## Project Structure

```
simple-todo/
├── .claude/               # Claude AI configurations
│   └── commands/          # Custom commands
├── .devcontainer/         # Dev container configuration
├── .github/               # GitHub configuration
│   └── workflows/         # CI/CD workflows
├── docs/                  # Documentation
│   ├── ARCHITECTURE.md    # System architecture
│   ├── CONTRIBUTING.md    # Contribution guidelines
│   └── DEVELOPMENT.md     # Developer setup guide
├── plans/                 # Technical implementation plans
├── specs/                 # Feature specifications
├── src/                   # Next.js application source code
│   ├── app/               # Next.js app directory
│   ├── public/            # Static assets
│   ├── types/             # TypeScript type definitions
│   ├── package.json       # Application dependencies
│   └── ...                # Next.js config files
├── stories/               # User stories
├── tests/                 # Integration tests
├── .editorconfig          # Editor configuration
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── LICENSE                # Project license
├── package.json           # Root project scripts
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd simple-todo
```

2. Navigate to the source directory
```bash
cd src
```

3. Install dependencies
```bash
npm install
```

4. Copy environment variables
```bash
cp ../.env.example .env
```

5. Run the development server
```bash
npm run dev
# or from root directory: npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

### Implemented Features

#### ✅ Core Todo Management
The core todo feature is fully implemented with:
- Create, read, update, and delete todos
- Filter by status (all, active, completed)
- Bulk operations (toggle all, clear completed)
- Local storage persistence with automatic saving
- Comprehensive error handling and recovery
- Performance optimizations with memoization
- Full test coverage (183 tests)

See [Core Todo Documentation](docs/features/core-todo.md) for detailed information.

### Specified Features (Ready for Implementation)

#### Core Features
- **[User Authentication](specs/user-auth.spec.md)** - Secure multi-provider authentication with email, Google, and GitHub OAuth
- **[Due Dates](specs/due-dates.spec.md)** - Assign deadlines, set reminders, and manage time-sensitive tasks with recurring options
- **[Notifications & Reminders](specs/notifications.spec.md)** - Multi-channel notification system with browser, email, and mobile push support

### Planned Features
- Categories and tags for todo organization
- Collaborative task sharing
- File attachments
- Search and filtering
- Data export/import
- Mobile applications

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **State Management**: Zustand with middleware pattern, localStorage persistence
- **Error Handling**: Custom error boundaries, Result pattern for async operations
- **Performance**: Memoized selectors, React.memo, debounced persistence
- **Developer Tools**: Store inspector, debug panel (development mode)
- **Authentication**: NextAuth.js (planned)
- **Notifications**: Web Push API, SendGrid/AWS SES, FCM/APNs (planned)
- **Testing**: Jest, React Testing Library (100% coverage for core features)
- **Code Quality**: ESLint, Prettier, TypeScript strict mode

## Development Workflow

This project was created using the following Claude Core Commands workflow:

### Project Setup
```bash
/core:project-setup simple-todo next.js
```

### Requirements Gathering
```bash
# Define feature requirements
/core:requirements core-todo "As a user, I want to create, update, complete, and delete todo items so I can manage my tasks."
/core:requirements user-auth "As a user, I want to sign in so I can securely access my todo list from any device."
/core:requirements due-dates "As a user, I want to assign due dates to tasks so I can keep track of deadlines."
/core:requirements notifications "As a user, I want to receive reminders so I don't forget important tasks."
```

### User Stories
```bash
# Generate user stories from requirements
/core:stories core-todo
/core:stories user-auth
/core:stories due-dates
/core:stories notifications
```

### Technical Implementation Plans
```bash
# Create detailed implementation plans
/core:plan core-todo
/core:plan user-auth
/core:plan due-dates
/core:plan notifications
```

### Feature Development
```bash
# Example: Implementing the core todo feature
1.  /core:implement core-todo
    /core:test core-todo --type all --run

    /core:review core-todo --strict
    /core:implement core-todo "a code review has been created. Fix all of the issues that
    are identified in '/workspaces/simple-todo/reviews/core-todo.review.md'"
    /core:review core-todo --strict

    /core:refactor core-todo --apply

    — manual prompt  —
    create a plan to implement the refactoring suggestions defined in ‘/workspaces/simple-todo/refactorings/core-todo.refactor.md’, save the comprehensive plan to ‘core-todo-refactor.implementation-plan’ and then implement the plan.
    — manual prompt  —

    /core:document core-todo --generate-missing
```

## Development

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for detailed development instructions.

### Feature Specifications

All feature requirements are documented in the `specs/` directory:
- Each feature has a comprehensive `.spec.md` file with detailed requirements
- Implementation checklists (`.checklist.md`) track development progress
- Specifications follow a consistent format covering user stories, functional/non-functional requirements, and technical details

## Contributing

Please read [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Working with Specifications

When implementing a feature:
1. Review the relevant specification in `specs/`
2. Use the associated checklist to track progress
3. Ensure all requirements are met before marking complete
4. Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
