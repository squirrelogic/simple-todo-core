# Simple Todo

A modern todo application built with Next.js

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

## Development

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for detailed development instructions.

## Contributing

Please read [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.