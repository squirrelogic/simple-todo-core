# Todo API Documentation

## Overview

The Todo API provides a comprehensive interface for managing todo items in the Simple Todo application. This document covers the store API, component props, hooks, and utility functions.

## Store API

### TodoStore Interface

```typescript
interface TodoStore {
  // State
  todos: TodoItem[];
  filter: FilterType;
  error: string | null;
  isLoading: boolean;

  // Actions
  addTodo: (text: string) => Promise<{ success: boolean; error?: string }>;
  updateTodo: (id: string, text: string) => Promise<{ success: boolean; error?: string }>;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  clearCompleted: () => void;
  toggleAll: () => void;
  setFilter: (filter: FilterType) => void;
  loadTodos: () => void;
  
  // Selectors
  getFilteredTodos: () => TodoItem[];
  getStats: () => { total: number; active: number; completed: number };
}
```

### Data Types

#### TodoItem

```typescript
interface TodoItem {
  id: string;          // Unique identifier (UUID v4)
  text: string;        // Todo text content
  completed: boolean;  // Completion status
  createdAt: number;   // Creation timestamp (Unix epoch)
  updatedAt: number;   // Last update timestamp (Unix epoch)
}
```

#### FilterType

```typescript
type FilterType = 'all' | 'active' | 'completed';
```

## Component APIs

### TodoApp

Main application container component.

```typescript
export function TodoApp(): JSX.Element
```

**Props**: None

**Usage**:
```tsx
<TodoApp />
```

### TodoInput

Input component for adding new todos.

```typescript
export function TodoInput(): JSX.Element
```

**Props**: None

**Features**:
- Character count display
- Validation feedback
- Loading state during submission
- Escape key to clear input

### TodoList

Container component for displaying filtered todos.

```typescript
export function TodoList(): JSX.Element
```

**Props**: None

**Features**:
- Automatic filtering based on store filter
- Loading state
- Empty state messages
- Focus management

### TodoItem

Individual todo item component.

```typescript
interface TodoItemProps {
  todo: TodoItem;
  onFocus?: (todoId: string) => void;
}

export function TodoItem({ todo, onFocus }: TodoItemProps): JSX.Element
```

**Props**:
- `todo`: The todo item data
- `onFocus`: Optional callback when item receives focus

### TodoFilter

Filter selection component.

```typescript
export const TodoFilter: React.MemoExoticComponent<() => JSX.Element>
```

**Props**: None

**Features**:
- Three filter options: All, Active, Completed
- Shows count for each filter
- Accessible tab navigation

### TodoFooter

Footer component with statistics and bulk actions.

```typescript
export function TodoFooter(): JSX.Element | null
```

**Props**: None

**Features**:
- Active todo count
- Toggle all button
- Clear completed button with confirmation

### TodoCheckbox

Checkbox component for todo completion status.

```typescript
interface TodoCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label: string;
}

export const TodoCheckbox: React.MemoExoticComponent<
  ({ checked, onChange, disabled, label }: TodoCheckboxProps) => JSX.Element
>
```

### TodoText

Text display and edit component.

```typescript
interface TodoTextProps {
  text: string;
  completed: boolean;
  isEditing: boolean;
  editText: string;
  onTextChange: (text: string) => void;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
  error?: string | null;
}

export const TodoText: React.MemoExoticComponent<
  (props: TodoTextProps) => JSX.Element
>
```

### TodoActions

Action buttons component.

```typescript
interface TodoActionsProps {
  isEditing: boolean;
  showDeleteConfirm: boolean;
  onEdit: () => void;
  onDelete: () => void;
  todoText: string;
}

export const TodoActions: React.MemoExoticComponent<
  (props: TodoActionsProps) => JSX.Element
>
```

## Hooks API

### useTodoEdit

Manages todo editing state and operations.

```typescript
interface UseTodoEditReturn {
  isEditing: boolean;
  editText: string;
  editError: string | null;
  isSaving: boolean;
  startEditing: () => void;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
  handleTextChange: (text: string) => void;
}

function useTodoEdit(
  todo: TodoItem,
  updateTodo: (id: string, text: string) => Promise<{ success: boolean; error?: string }>
): UseTodoEditReturn
```

**Usage**:
```typescript
const editState = useTodoEdit(todo, updateTodo);
```

### useKeyboardNavigation

Provides keyboard navigation functionality.

```typescript
interface UseKeyboardNavigationReturn {
  handleKeyDown: (e: React.KeyboardEvent, currentId: string) => void;
}

function useKeyboardNavigation(): UseKeyboardNavigationReturn
```

**Keyboard shortcuts**:
- `ArrowUp`: Focus previous todo
- `ArrowDown`: Focus next todo

### useConfirmation

Manages confirmation state for destructive actions.

```typescript
interface UseConfirmationOptions {
  onConfirm: () => void;
  timeout?: number;
}

interface UseConfirmationReturn {
  showConfirmation: boolean;
  requestConfirmation: () => void;
  confirm: () => void;
  cancel: () => void;
}

function useConfirmation(options: UseConfirmationOptions): UseConfirmationReturn
```

## Selectors API

### useFilteredTodos

Returns memoized filtered todos.

```typescript
function useFilteredTodos(): TodoItem[]
```

### useTodoStats

Returns memoized todo statistics.

```typescript
interface TodoStats {
  total: number;
  active: number;
  completed: number;
}

function useTodoStats(): TodoStats
```

### useActiveTodosCount

Returns count of active todos.

```typescript
function useActiveTodosCount(): number
```

### useCompletedTodosCount

Returns count of completed todos.

```typescript
function useCompletedTodosCount(): number
```

### useAllTodosCompleted

Checks if all todos are completed.

```typescript
function useAllTodosCompleted(): boolean
```

### useHasCompletedTodos

Checks if there are any completed todos.

```typescript
function useHasCompletedTodos(): boolean
```

## Utility Functions API

### Validation

```typescript
interface ValidationResult {
  isValid: boolean;
  error?: string;
}

function validateTodoText(text: string): ValidationResult
function sanitizeTodoText(text: string): string
```

**Constants**:
```typescript
const TODO_TEXT_MIN_LENGTH = 1;
const TODO_TEXT_MAX_LENGTH = 500;
```

### Filters

```typescript
function applyFilter(todos: TodoItem[], filter: FilterType): TodoItem[]
function getTodoStats(todos: TodoItem[]): TodoStats
```

### Storage

```typescript
interface TodoStorage {
  save(todos: TodoItem[], filter: FilterType): void;
  load(): { todos: TodoItem[]; filter: FilterType } | null;
  clear(): void;
  getStorageSize(): number;
}

const todoStorage: TodoStorage
```

## Error Handling API

### Error Types

```typescript
class AppError extends Error {
  code: string;
  timestamp: Date;
  context?: Record<string, unknown>;
}

class ValidationError extends AppError
class StorageError extends AppError
class NetworkError extends AppError
class NotFoundError extends AppError
class PermissionError extends AppError
class UnknownError extends AppError
```

### Error Utilities

```typescript
// Result type for operations that can fail
type Result<T, E = AppError> =
  | { success: true; data: T }
  | { success: false; error: E };

// Helper functions
function success<T>(data: T): Result<T>
function failure<E = AppError>(error: E): Result<never, E>

// Try/catch wrappers
function tryAsync<T>(operation: () => Promise<T>): Promise<Result<T>>
function trySync<T>(operation: () => T): Result<T>

// Retry with backoff
function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options?: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    shouldRetry?: (error: AppError) => boolean;
  }
): Promise<Result<T>>
```

## Middleware API

### Persistence Middleware

```typescript
interface PersistenceConfig<T> {
  persist: (state: T) => void;
  debounceMs?: number;
  enabled?: boolean;
}

function persistence<T extends object>(
  config: PersistenceConfig<T>
): Middleware
```

### Logger Middleware

```typescript
interface LoggerConfig<T> {
  name?: string;
  collapsed?: boolean;
  diff?: boolean;
  predicate?: (state: T, prevState: T) => boolean;
  enabled?: boolean;
}

function logger<T extends object>(
  config: LoggerConfig<T>
): Middleware
```

### DevTools Middleware

```typescript
interface DevToolsConfig {
  name?: string;
  trace?: boolean;
}

function devtools<T extends object>(
  config: DevToolsConfig
): Middleware
```

### Compose Middleware

```typescript
function compose<T>(...middlewares: Middleware[]): Middleware
```

## Development API

### Store Inspector

Available in development at `window.__todoStoreInspector`.

```typescript
interface StoreInspector {
  getState(): TodoStore;
  logState(label?: string): void;
  getTodosByStatus(): {
    active: TodoItem[];
    completed: TodoItem[];
    total: number;
  };
  findTodos(searchText: string): TodoItem[];
  getMetrics(): {
    todoCount: number;
    oldestTodo: Date | null;
    newestTodo: Date | null;
    averageAge: number; // hours
    completionRate: string; // percentage
  };
  exportState(): string; // JSON
  reset(): void; // Dangerous - clears all todos
}
```

### Debug Panel

The `DebugPanel` component provides a visual interface for debugging in development.

```typescript
export function DebugPanel(): JSX.Element | null
```

**Features**:
- State overview
- Performance metrics
- Export functionality
- Console logging

## Usage Examples

### Basic Todo Operations

```typescript
import { useTodoStore } from '@/stores/todos/todo-store';

// Add a todo
const result = await useTodoStore.getState().addTodo('New task');
if (!result.success) {
  console.error(result.error);
}

// Update a todo
const updateResult = await useTodoStore.getState().updateTodo('123', 'Updated task');

// Toggle completion
useTodoStore.getState().toggleTodo('123');

// Delete a todo
useTodoStore.getState().deleteTodo('123');

// Filter todos
useTodoStore.getState().setFilter('active');

// Get filtered todos
const todos = useTodoStore.getState().getFilteredTodos();

// Get statistics
const stats = useTodoStore.getState().getStats();
console.log(`${stats.active} todos remaining`);
```

### Using Selectors in Components

```typescript
import { useFilteredTodos, useTodoStats } from '@/stores/todos/selectors';

function TodoDashboard() {
  const todos = useFilteredTodos();
  const stats = useTodoStats();
  
  return (
    <div>
      <h2>Todo Dashboard</h2>
      <p>Total: {stats.total}</p>
      <p>Active: {stats.active}</p>
      <p>Completed: {stats.completed}</p>
      <p>Completion Rate: {((stats.completed / stats.total) * 100).toFixed(1)}%</p>
    </div>
  );
}
```

### Error Handling Patterns

```typescript
import { tryAsync } from '@/lib/errors/error-utils';
import { todoStorage } from '@/lib/storage/todo-storage';

// Safe async operation
const result = await tryAsync(async () => {
  const response = await fetch('/api/todos');
  return response.json();
});

if (result.success) {
  console.log('Todos loaded:', result.data);
} else {
  console.error('Failed to load:', result.error.message);
}

// With retry
const retryResult = await retryWithBackoff(
  () => fetch('/api/todos'),
  { maxRetries: 3, initialDelay: 1000 }
);
```