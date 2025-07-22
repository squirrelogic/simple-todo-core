import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import { TodoItem, FilterType } from '@/types/todo';
import { validateTodoText, sanitizeTodoText } from '@/lib/validation/todo';
import { todoStorage } from '@/lib/storage/todo-storage';
import { applyFilter, getTodoStats } from '@/lib/utils/todo-filters';

interface TodoState {
  todos: TodoItem[];
  filter: FilterType;
  error: string | null;
  isLoading: boolean;
}

interface TodoActions {
  addTodo: (text: string) => void;
  updateTodo: (id: string, text: string) => void;
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

export const useTodoStore = create<TodoStore>()(
  immer((set, get) => {
    // Helper to persist state after mutations
    const persistState = () => {
      const { todos, filter } = get();
      todoStorage.save(todos, filter);
    };

    return {
    // Initial state
    todos: [],
    filter: 'all',
    error: null,
    isLoading: false,

    // Actions
    addTodo: (text: string) => {
      const validation = validateTodoText(text);
      
      if (!validation.isValid) {
        set((state) => {
          state.error = validation.error || 'Invalid todo text';
        });
        return;
      }

      const sanitizedText = sanitizeTodoText(text);
      const now = Date.now();
      
      const newTodo: TodoItem = {
        id: uuidv4(),
        text: sanitizedText,
        completed: false,
        createdAt: now,
        updatedAt: now,
      };

      set((state) => {
        state.todos.unshift(newTodo);
        state.error = null;
      });

      // Save to storage
      persistState();
    },

    updateTodo: (id: string, text: string) => {
      const validation = validateTodoText(text);
      
      if (!validation.isValid) {
        set((state) => {
          state.error = validation.error || 'Invalid todo text';
        });
        return;
      }

      const sanitizedText = sanitizeTodoText(text);

      set((state) => {
        const todoIndex = state.todos.findIndex(todo => todo.id === id);
        if (todoIndex !== -1) {
          state.todos[todoIndex].text = sanitizedText;
          state.todos[todoIndex].updatedAt = Date.now();
        }
        state.error = null;
      });

      // Save to storage
      persistState();
    },

    toggleTodo: (id: string) => {
      set((state) => {
        const todoIndex = state.todos.findIndex(todo => todo.id === id);
        if (todoIndex !== -1) {
          state.todos[todoIndex].completed = !state.todos[todoIndex].completed;
          state.todos[todoIndex].updatedAt = Date.now();
        }
      });

      // Save to storage
      persistState();
    },

    deleteTodo: (id: string) => {
      set((state) => {
        state.todos = state.todos.filter(todo => todo.id !== id);
      });

      // Save to storage
      persistState();
    },

    clearCompleted: () => {
      set((state) => {
        state.todos = state.todos.filter(todo => !todo.completed);
      });

      // Save to storage
      persistState();
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

      // Save to storage
      persistState();
    },

    setFilter: (filter: FilterType) => {
      set((state) => {
        state.filter = filter;
      });

      // Save to storage
      persistState();
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
    };
  })
);