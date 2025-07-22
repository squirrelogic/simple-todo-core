# Development Guide

This guide will help you get started with developing the Simple Todo application.

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher (comes with Node.js)
- Git

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd simple-todo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your local configuration.

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Run the production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── app/           # Next.js app directory
├── components/    # React components
├── lib/           # Utility functions and libraries
├── styles/        # Global styles
└── types/         # TypeScript type definitions
```

## Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

Run `npm run lint` and `npm run format` before committing.

## Testing

We use Jest and React Testing Library for testing.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Git Workflow

1. Create a feature branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

3. Push to your fork and create a pull request

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Debugging

### VS Code

The project includes VS Code debugging configuration. Press `F5` to start debugging.

### Chrome DevTools

1. Run `npm run dev`
2. Open Chrome DevTools
3. Go to `chrome://inspect`
4. Click "inspect" on the Node.js process

## Performance

- Use React DevTools Profiler to identify performance bottlenecks
- Keep bundle size small - check with `npm run build`
- Use dynamic imports for code splitting

## Troubleshooting

### Common Issues

**Port 3000 is already in use**
```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

**Module not found errors**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

**TypeScript errors**
```bash
# Check for type errors
npm run type-check
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)