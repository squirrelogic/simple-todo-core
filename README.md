# Simple Todo

A modern, feature-rich todo application built with Next.js, designed to help users manage their tasks efficiently with advanced features like due dates, notifications, and user authentication.

## Project Structure

```
simple-todo/
├── .claude/               # Claude AI configurations
│   └── commands/          # Custom commands
├── .devcontainer/         # Dev container configuration
├── .github/               # GitHub configuration
│   └── workflows/         # CI/CD workflows
├── build/                 # Build artifacts
├── designs/               # Architecture and design documents
├── dist/                  # Distribution files
├── docs/                  # Documentation
│   ├── ARCHITECTURE.md    # System architecture
│   ├── CONTRIBUTING.md    # Contribution guidelines
│   └── DEVELOPMENT.md     # Developer setup guide
├── plans/                 # Technical implementation plans
├── scripts/               # Utility scripts
├── specs/                 # Feature specifications
├── src/                   # Source code
├── stories/               # User stories
├── tests/                 # Test files
├── .editorconfig          # Editor configuration
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── LICENSE                # Project license
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

2. Install dependencies
```bash
npm install
```

3. Copy environment variables
```bash
cp .env.example .env
```

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

### Current Specifications

The following features have been fully specified and are ready for implementation:

#### Core Features
- **[Core Todo Management](specs/core-todo.spec.md)** - Create, read, update, and delete todos with local storage persistence
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
- **State Management**: React Context API, localStorage (future: PostgreSQL)
- **Authentication**: NextAuth.js (planned)
- **Notifications**: Web Push API, SendGrid/AWS SES, FCM/APNs (planned)
- **Testing**: Jest, React Testing Library
- **Code Quality**: ESLint, Prettier

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
