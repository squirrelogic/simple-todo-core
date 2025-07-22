# Core Todo Feature Documentation

## Overview

The Core Todo feature is the heart of the Simple Todo application, providing a complete todo list management system with modern React patterns, TypeScript, and robust error handling. This feature allows users to create, read, update, and delete todos with a clean, accessible interface.

## Architecture

### Component Structure

```
components/todos/
├── TodoApp.tsx         # Main application container
├── TodoInput.tsx       # Input component for adding todos
├── TodoList.tsx        # List container with filtering
├── TodoItem.tsx        # Individual todo item container
├── TodoFilter.tsx      # Filter selection component
├── TodoFooter.tsx      # Footer with stats and actions
├── TodoCheckbox.tsx    # Checkbox component (memoized)
├── TodoText.tsx        # Todo text display/edit component
├── TodoActions.tsx     # Action buttons component
└── Todo.tsx           # Compound component pattern wrapper
```

### State Management

The application uses Zustand for state management with a middleware pattern:

```typescript
stores/todos/
├── todo-store.ts      # Main store with middleware
└── selectors.ts       # Memoized selectors for performance
```

### Key Features

- **Async Actions**: All mutations return Promises with success/error results
- **Automatic Persistence**: State changes are automatically saved with debouncing
- **Error Boundaries**: Comprehensive error handling at multiple levels
- **Performance Optimized**: Memoized selectors and React.memo for efficiency
- **Developer Tools**: Built-in debugging tools in development mode

## API Reference

### Store Actions

#### `addTodo(text: string): Promise<{ success: boolean; error?: string }>`
Adds a new todo item.

```typescript
const result = await addTodo('Buy groceries');
if (result.success) {
  console.log('Todo added successfully');
} else {
  console.error('Failed to add todo:', result.error);
}
```

#### `updateTodo(id: string, text: string): Promise<{ success: boolean; error?: string }>`
Updates an existing todo's text.

```typescript
const result = await updateTodo('123', 'Buy organic groceries');
if (!result.success) {
  console.error('Update failed:', result.error);
}
```

#### `toggleTodo(id: string): void`
Toggles the completion status of a todo.

```typescript
toggleTodo('123'); // Marks as completed/uncompleted
```

#### `deleteTodo(id: string): void`
Deletes a todo item.

```typescript
deleteTodo('123'); // Removes the todo
```

#### `clearCompleted(): void`
Removes all completed todos.

```typescript
clearCompleted(); // Clears all completed items
```

#### `toggleAll(): void`
Toggles all todos to the opposite of the majority state.

```typescript
toggleAll(); // If most are incomplete, marks all as complete
```

#### `setFilter(filter: FilterType): void`
Sets the current filter view.

```typescript
setFilter('active'); // Shows only incomplete todos
// FilterType = 'all' | 'active' | 'completed'
```

### Selectors

#### `useFilteredTodos(): TodoItem[]`
Returns memoized filtered todos based on current filter.

```typescript
const todos = useFilteredTodos();
// Automatically updates when todos or filter changes
```

#### `useTodoStats(): { total: number; active: number; completed: number }`
Returns memoized todo statistics.

```typescript
const stats = useTodoStats();
console.log(`${stats.active} todos remaining`);
```

### Custom Hooks

#### `useTodoEdit(todo: TodoItem, updateTodo: Function)`
Manages todo editing state and operations.

```typescript
const {
  isEditing,
  editText,
  editError,
  isSaving,
  startEditing,
  handleSave,
  handleCancel,
  handleTextChange
} = useTodoEdit(todo, updateTodo);
```

#### `useKeyboardNavigation()`
Provides keyboard navigation between todos.

```typescript
const { handleKeyDown } = useKeyboardNavigation();
// Use in onKeyDown handlers for arrow key navigation
```

## Configuration

### Environment Variables

```bash
NODE_ENV=development  # Enables debug tools and logging
```

### Storage Configuration

The todo store uses localStorage with the following configuration:

```typescript
const STORAGE_KEY = 'simple-todo-app';
const STORAGE_VERSION = 1;
const DEBOUNCE_MS = 500; // Persistence debounce delay
```

### Validation Rules

```typescript
const TODO_TEXT_MIN_LENGTH = 1;
const TODO_TEXT_MAX_LENGTH = 500;
```

## Usage Examples

### Basic Usage

```tsx
import { TodoApp } from '@/components/todos/TodoApp';

export default function Home() {
  return <TodoApp />;
}
```

### Using the Store Directly

```tsx
import { useTodoStore } from '@/stores/todos/todo-store';

function MyComponent() {
  const todos = useTodoStore((state) => state.todos);
  const addTodo = useTodoStore((state) => state.addTodo);
  
  const handleAdd = async () => {
    const result = await addTodo('New todo');
    if (!result.success) {
      alert(result.error);
    }
  };
  
  return (
    <div>
      <button onClick={handleAdd}>Add Todo</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Advanced Usage with Selectors

```tsx
import { useFilteredTodos, useTodoStats } from '@/stores/todos/selectors';

function TodoSummary() {
  const todos = useFilteredTodos();
  const stats = useTodoStats();
  
  return (
    <div>
      <p>Showing {todos.length} of {stats.total} todos</p>
      <p>{stats.completed} completed, {stats.active} remaining</p>
    </div>
  );
}
```

### Custom Error Handling

```tsx
import { TodoErrorBoundary } from '@/components/errors';

function SafeTodoApp() {
  return (
    <TodoErrorBoundary>
      <TodoApp />
    </TodoErrorBoundary>
  );
}
```

## Error Handling

### Error Types

The application uses a comprehensive error type system:

```typescript
// Base error class
class AppError extends Error {
  code: string;
  timestamp: Date;
  context?: Record<string, unknown>;
}

// Specific error types
class ValidationError extends AppError
class StorageError extends AppError
class NotFoundError extends AppError
```

### Error Boundaries

Three levels of error boundaries protect the application:

1. **AppErrorBoundary**: Top-level application errors
2. **TodoErrorBoundary**: Todo-specific errors
3. **Base ErrorBoundary**: Reusable error boundary component

### Common Error Scenarios

1. **Validation Errors**
   - Empty todo text
   - Text exceeding maximum length
   - Invalid characters

2. **Storage Errors**
   - localStorage quota exceeded
   - Browser storage disabled
   - Corrupted storage data

3. **State Errors**
   - Todo not found
   - Invalid filter type
   - Concurrent modification

## Testing

### Running Tests

```bash
npm test                    # Run all tests
npm test TodoInput         # Test specific component
npm run test:coverage      # Generate coverage report
```

### Test Structure

```
components/todos/__tests__/
├── TodoInput.test.tsx     # Input component tests
├── TodoList.test.tsx      # List component tests
├── TodoItem.test.tsx      # Item component tests
├── TodoFilter.test.tsx    # Filter component tests
├── TodoFooter.test.tsx    # Footer component tests
├── TodoActions.test.tsx   # Actions component tests
├── TodoCheckbox.test.tsx  # Checkbox component tests
└── TodoText.test.tsx      # Text component tests
```

### Test Coverage

The core-todo feature maintains high test coverage:
- Components: 100% coverage
- Store actions: 100% coverage
- Utilities: 100% coverage
- Error handling: Comprehensive edge case testing

## Troubleshooting

### Common Issues

#### Todos Not Persisting

**Problem**: Todos disappear on page refresh.

**Solution**: Check browser localStorage settings:
```javascript
// Test localStorage availability
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
} catch (e) {
  console.error('localStorage not available:', e);
}
```

#### Performance Issues with Large Lists

**Problem**: UI becomes sluggish with many todos.

**Solution**: The app uses memoization, but for 1000+ items consider:
- Implementing virtual scrolling
- Paginating the todo list
- Using the filter feature to reduce visible items

#### State Not Updating

**Problem**: UI doesn't reflect state changes.

**Solution**: Ensure you're using the store correctly:
```typescript
// ❌ Wrong - mutating state directly
const todos = useTodoStore.getState().todos;
todos.push(newTodo);

// ✅ Correct - using actions
const addTodo = useTodoStore((state) => state.addTodo);
await addTodo(newTodo.text);
```

### Debug Tools

In development mode, access the store inspector:

```javascript
// Open browser console
window.__todoStoreInspector.logState();
window.__todoStoreInspector.getMetrics();
window.__todoStoreInspector.exportState();
```

The Debug Panel (bottom-right in development) provides:
- Current state overview
- Performance metrics
- State export functionality
- Console logging

### Error Recovery

If the application enters an error state:

1. **Soft Reset**: Click "Reset" in the error boundary
2. **Hard Reset**: Clear localStorage and refresh
   ```javascript
   localStorage.removeItem('simple-todo-app');
   location.reload();
   ```
3. **Debug Mode**: Check console for detailed error logs

## Performance Considerations

### Optimizations Implemented

1. **Memoized Selectors**: Prevent unnecessary recalculations
2. **React.memo**: Reduce re-renders of presentational components
3. **Debounced Persistence**: Batch storage operations
4. **Middleware Pattern**: Efficient state updates

### Performance Metrics

Monitor performance using the debug tools:

```javascript
const metrics = window.__todoStoreInspector.getMetrics();
console.log(metrics);
// {
//   todoCount: 42,
//   completionRate: "73.81%",
//   averageAge: 24.5, // hours
//   oldestTodo: Date,
//   newestTodo: Date
// }
```

## Migration Guide

### From Previous Versions

If migrating from an older version without middleware:

1. **Update Store Usage**:
   ```typescript
   // Old pattern
   addTodo(text);
   persistState(); // Manual save
   
   // New pattern
   await addTodo(text); // Auto-persists
   ```

2. **Update Error Handling**:
   ```typescript
   // Old pattern
   if (!validateTodo(text)) return;
   
   // New pattern
   const result = await addTodo(text);
   if (!result.success) {
     console.error(result.error);
   }
   ```

3. **Update Component Imports**:
   ```typescript
   // Old pattern
   import TodoItem from './TodoItem';
   
   // New pattern
   import { TodoItem } from './TodoItem';
   import { TodoCheckbox } from './TodoCheckbox';
   ```

## Future Enhancements

Planned improvements for the core-todo feature:

1. **Virtual Scrolling**: For lists with 1000+ items
2. **Offline Support**: Service worker integration
3. **Advanced Features**:
   - Todo categories/tags
   - Due dates and reminders
   - Search functionality
   - Bulk operations
   - Drag-and-drop reordering

## Contributing

When contributing to the core-todo feature:

1. Follow the established patterns
2. Maintain test coverage above 90%
3. Update documentation for new features
4. Use TypeScript strict mode
5. Run linting before committing

## Related Documentation

- [Main README](/README.md)
- [Architecture Overview](/docs/architecture.md)
- [API Documentation](/docs/api/todo-api.md)
- [Testing Guide](/docs/testing.md)