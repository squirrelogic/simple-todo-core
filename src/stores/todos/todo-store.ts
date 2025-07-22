import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import { TodoItem, FilterType } from '@/types/todo';
import { validateTodoText, sanitizeTodoText } from '@/lib/validation/todo';
import { todoStorage } from '@/lib/storage/todo-storage';
import { applyFilter, getTodoStats } from '@/lib/utils/todo-filters';
import { persistence, logger, devtools, compose } from '@/stores/middleware';
import { ValidationError, NotFoundError, StorageError } from '@/types/errors';
import { tryAsync, normalizeError, getUserMessage } from '@/lib/errors/error-utils';

interface TodoState {
  todos: TodoItem[];
  filter: FilterType;
  error: string | null;
  isLoading: boolean;
}

interface TodoActions {
  addTodo: (text: string) => Promise<{ success: boolean; error?: string }>;
  updateTodo: (id: string, text: string) => Promise<{ success: boolean; error?: string }>;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  clearCompleted: () => void;
  toggleAll: () => void;
  setFilter: (filter: FilterType) => void;
  loadTodos: () => void;
  getFilteredTodos: () => TodoItem[];
  getStats: () => { total: number; active: number; completed: number };
}

type TodoStore = TodoState & TodoActions;

// Create middleware stack
const middlewareStack = compose<TodoStore>(
  immer,
  persistence<TodoStore>({
    persist: (state) => {
      todoStorage.save(state.todos, state.filter);
    },
    debounceMs: 500,
  }),
  logger<TodoStore>({
    name: 'TodoStore',
    collapsed: true,
    diff: true,
  }),
  devtools<TodoStore>({
    name: 'TodoStore',
  })
);

export const useTodoStore = create<TodoStore>()(
  middlewareStack((set, get) => ({
    // Initial state
    todos: [],
    filter: 'all',
    error: null,
    isLoading: false,

    // Actions
    addTodo: async (text: string) => {
      const result = await tryAsync(async () => {
        // Validate input
        const validation = validateTodoText(text);
        if (!validation.isValid) {
          throw new ValidationError(validation.error || 'Invalid todo text', 'text', text);
        }

        // Create new todo
        const sanitizedText = sanitizeTodoText(text);
        const now = Date.now();
        
        const newTodo: TodoItem = {
          id: uuidv4(),
          text: sanitizedText,
          completed: false,
          createdAt: now,
          updatedAt: now,
        };

        // Update state
        set((state) => {
          state.todos.unshift(newTodo);
          state.error = null;
        });
        
        return newTodo;
      });

      if (!result.success) {
        const userMessage = getUserMessage(result.error);
        set((state) => {
          state.error = userMessage;
        });
        return { success: false, error: userMessage };
      }

      return { success: true };
    },

    updateTodo: async (id: string, text: string) => {
      const result = await tryAsync(async () => {
        // Validate input
        const validation = validateTodoText(text);
        if (!validation.isValid) {
          throw new ValidationError(validation.error || 'Invalid todo text', 'text', text);
        }

        const sanitizedText = sanitizeTodoText(text);

        // Find and update todo
        let updatedTodo: TodoItem | null = null;
        set((state) => {
          const todoIndex = state.todos.findIndex(todo => todo.id === id);
          if (todoIndex !== -1) {
            state.todos[todoIndex].text = sanitizedText;
            state.todos[todoIndex].updatedAt = Date.now();
            updatedTodo = state.todos[todoIndex];
          }
          state.error = null;
        });

        if (!updatedTodo) {
          throw new NotFoundError('Todo', id);
        }
        
        return updatedTodo;
      });

      if (!result.success) {
        const userMessage = getUserMessage(result.error);
        set((state) => {
          state.error = userMessage;
        });
        return { success: false, error: userMessage };
      }

      return { success: true };
    },

    toggleTodo: (id: string) => {
      set((state) => {
        const todoIndex = state.todos.findIndex(todo => todo.id === id);
        if (todoIndex !== -1) {
          state.todos[todoIndex].completed = !state.todos[todoIndex].completed;
          state.todos[todoIndex].updatedAt = Date.now();
        }
      });
    },

    deleteTodo: (id: string) => {
      set((state) => {
        state.todos = state.todos.filter(todo => todo.id !== id);
      });
    },

    clearCompleted: () => {
      set((state) => {
        state.todos = state.todos.filter(todo => !todo.completed);
      });
    },

    toggleAll: () => {
      set((state) => {
        const allCompleted = state.todos.every(todo => todo.completed);
        const now = Date.now();
        
        state.todos.forEach(todo => {
          todo.completed = !allCompleted;
          todo.updatedAt = now;
        });
      });
    },

    setFilter: (filter: FilterType) => {
      set((state) => {
        state.filter = filter;
      });
    },

    loadTodos: () => {
      set((state) => {
        state.isLoading = true;
      });

      const stored = todoStorage.load();
      
      set((state) => {
        if (stored) {
          state.todos = stored.todos;
          state.filter = stored.filter;
        }
        state.isLoading = false;
      });
    },

    getFilteredTodos: () => {
      const { todos, filter } = get();
      return applyFilter(todos, filter);
    },

    getStats: () => {
      const { todos } = get();
      return getTodoStats(todos);
    },
  }))
);