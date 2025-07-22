/**
 * Development utilities for inspecting and debugging store state
 * Only available in development mode
 */

import { useTodoStore } from '@/stores/todos/todo-store';

/**
 * Store inspector for debugging store state in development
 */
export class StoreInspector {
  private static instance: StoreInspector | null = null;

  private constructor() {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('StoreInspector is only available in development mode');
    }
  }

  static getInstance(): StoreInspector {
    if (!StoreInspector.instance) {
      StoreInspector.instance = new StoreInspector();
    }
    return StoreInspector.instance;
  }

  /**
   * Get current store state
   */
  getState() {
    return useTodoStore.getState();
  }

  /**
   * Log current store state
   */
  logState(label?: string) {
    const state = this.getState();
    console.group(label || 'Store State');
    console.log('Todos:', state.todos);
    console.log('Filter:', state.filter);
    console.log('Error:', state.error);
    console.log('Loading:', state.isLoading);
    console.groupEnd();
  }

  /**
   * Get todos by status
   */
  getTodosByStatus() {
    const { todos } = this.getState();
    return {
      active: todos.filter(t => !t.completed),
      completed: todos.filter(t => t.completed),
      total: todos.length
    };
  }

  /**
   * Find todos by text (partial match)
   */
  findTodos(searchText: string) {
    const { todos } = this.getState();
    const lower = searchText.toLowerCase();
    return todos.filter(todo => 
      todo.text.toLowerCase().includes(lower)
    );
  }

  /**
   * Get store performance metrics
   */
  getMetrics() {
    const { todos } = this.getState();
    const now = Date.now();
    
    return {
      todoCount: todos.length,
      oldestTodo: todos.length > 0 
        ? new Date(Math.min(...todos.map(t => t.createdAt)))
        : null,
      newestTodo: todos.length > 0
        ? new Date(Math.max(...todos.map(t => t.createdAt)))
        : null,
      averageAge: todos.length > 0
        ? todos.reduce((sum, t) => sum + (now - t.createdAt), 0) / todos.length / 1000 / 60 / 60 // hours
        : 0,
      completionRate: todos.length > 0
        ? (todos.filter(t => t.completed).length / todos.length * 100).toFixed(2) + '%'
        : '0%'
    };
  }

  /**
   * Export current state as JSON
   */
  exportState() {
    const state = this.getState();
    const data = {
      todos: state.todos,
      filter: state.filter,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * Reset store to initial state (dangerous!)
   */
  reset() {
    if (confirm('Are you sure you want to reset the store? This will delete all todos!')) {
      const state = useTodoStore.getState();
      state.todos = [];
      state.filter = 'all';
      state.error = null;
      state.isLoading = false;
      console.log('Store has been reset');
    }
  }
}

// Attach to window in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).__todoStoreInspector = StoreInspector.getInstance();
  console.log('Todo Store Inspector available at: window.__todoStoreInspector');
  console.log('Available methods: logState(), getState(), getTodosByStatus(), findTodos(), getMetrics(), exportState(), reset()');
}