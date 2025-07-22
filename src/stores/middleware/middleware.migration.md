# Store Middleware Pattern Migration Guide

## Overview

The todo store has been refactored to use a middleware pattern, eliminating the need for manual `persistState()` calls after every action. This improves code maintainability and reduces duplication.

## Changes Made

### 1. Middleware System

Created a flexible middleware system with:

- **persistence**: Automatically saves state changes with optional debouncing
- **logger**: Logs state changes in development for debugging
- **devtools**: Integrates with Redux DevTools Extension
- **compose**: Combines multiple middleware into a single enhancer

### 2. Store Refactoring

Before:
```typescript
addTodo: (text: string) => {
  // ... add todo logic
  persistState(); // Manual call required
}
```

After:
```typescript
addTodo: async (text: string) => {
  // ... add todo logic
  // Persistence happens automatically!
}
```

### 3. Benefits

1. **DRY Principle**: No more repeated `persistState()` calls
2. **Configurability**: Easy to add/remove middleware
3. **Debugging**: Built-in logging and DevTools support
4. **Performance**: Debounced persistence reduces I/O operations
5. **Error Handling**: Persistence errors are caught and logged

## Middleware Configuration

### Persistence Middleware

```typescript
persistence<TodoStore>({
  persist: (state) => {
    todoStorage.save(state.todos, state.filter);
  },
  debounceMs: 500, // Debounce saves by 500ms
  enabled: true,    // Can be toggled
})
```

### Logger Middleware

```typescript
logger<TodoStore>({
  name: 'TodoStore',
  collapsed: true,  // Collapsed groups in console
  diff: true,       // Show state differences
  enabled: process.env.NODE_ENV === 'development',
})
```

### DevTools Middleware

```typescript
devtools<TodoStore>({
  name: 'TodoStore',
  trace: true,  // Stack traces for actions
})
```

## Creating Custom Middleware

```typescript
const myMiddleware = <T extends object>(config: MyConfig) => 
  (f: StateCreator<T, [], []>): StateCreator<T, [], []> => 
  (set, get, api) => {
    const enhancedSet: typeof set = (partial, replace) => {
      // Pre-processing
      console.log('Before state change');
      
      // Apply state change
      set(partial, replace);
      
      // Post-processing
      console.log('After state change');
    };
    
    return f(enhancedSet, get, api);
  };
```

## Usage

No changes required for consumers! The store API remains the same:

```typescript
const { addTodo, todos } = useTodoStore();
```

## Performance Considerations

1. **Debouncing**: Persistence is debounced by 500ms to reduce I/O
2. **Development Only**: Logger and DevTools are disabled in production
3. **Error Isolation**: Persistence errors don't affect state updates

## Testing

All middleware are fully tested:
- `persistence.test.ts`: Tests debouncing, error handling
- `logger.test.ts`: Tests logging behavior and configuration

## Migration Steps

1. No action required for existing code
2. Remove any manual `persistState()` calls if customizing
3. Configure middleware stack as needed in store creation