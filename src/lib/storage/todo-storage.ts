import { TodoItem, FilterType } from '@/types/todo';

const STORAGE_KEY = 'simple-todo-app';
const STORAGE_VERSION = 1;

interface StorageData {
  version: number;
  todos: TodoItem[];
  filter: FilterType;
}

export const todoStorage = {
  save(todos: TodoItem[], filter: FilterType): void {
    try {
      const data: StorageData = {
        version: STORAGE_VERSION,
        todos,
        filter,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save todos to localStorage:', error);
    }
  },

  load(): { todos: TodoItem[]; filter: FilterType } | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const data: StorageData = JSON.parse(stored);
      
      // Handle version migrations if needed
      if (data.version !== STORAGE_VERSION) {
        // Future migration logic here
        return null;
      }

      return {
        todos: data.todos || [],
        filter: data.filter || 'all',
      };
    } catch (error) {
      console.error('Failed to load todos from localStorage:', error);
      return null;
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear todos from localStorage:', error);
    }
  },

  getStorageSize(): number {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? new Blob([stored]).size : 0;
    } catch {
      return 0;
    }
  },
};